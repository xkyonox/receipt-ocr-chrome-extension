let selectedFiles = [];
let extractedData = [];

// Tesseract 초기화 없이 직접 사용
async function performOCRDirect(imageData) {
    console.log('Tesseract OCR 직접 실행 (Worker 없음)');
    
    try {
        // recognize 메서드를 직접 사용 (Worker 비활성화)
        const result = await Tesseract.recognize(
            imageData,
            'kor+eng',
            {
                workerPath: null,  // Worker 사용 안함
                langPath: 'https://tessdata.projectnaptha.com/4.0.0',
                logger: m => {
                    console.log('Tesseract:', m.status, m.progress ? `${Math.round(m.progress * 100)}%` : '');
                    if (m.status === 'recognizing text') {
                        showStatus(`텍스트 인식 중... ${Math.round(m.progress * 100)}%`, 'info');
                    }
                }
            }
        );
        
        console.log('✅ OCR 완료');
        return result.data.text;
    } catch (error) {
        console.error('❌ OCR 오류:', error);
        throw error;
    }
}

// DOM 요소
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const processBtn = document.getElementById('processBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const countBadge = document.getElementById('countBadge');
const fileCount = document.getElementById('fileCount');

// 초기화 확인
console.log('=== 영수증 OCR 확장 프로그램 시작 ===');
console.log('Tesseract 상태:', typeof Tesseract);

// 업로드 영역 클릭
uploadArea.addEventListener('click', () => {
    console.log('업로드 영역 클릭됨');
    fileInput.click();
});

// 파일 선택
fileInput.addEventListener('change', (e) => {
    console.log('파일 선택됨:', e.target.files.length, '개');
    handleFiles(e.target.files);
});

// 드래그 앤 드롭
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    console.log('파일 드롭됨:', e.dataTransfer.files.length, '개');
    handleFiles(e.dataTransfer.files);
});

// 파일 처리 (단순화)
function handleFiles(files) {
    console.log('handleFiles 호출됨:', files.length, '개 파일');
    
    const newFiles = Array.from(files).filter(file => {
        console.log('파일 타입:', file.type, '이름:', file.name);
        return file.type.startsWith('image/') || 
               file.name.toLowerCase().endsWith('.heic') ||
               file.name.toLowerCase().endsWith('.heif');
    });
    
    console.log('필터링 후:', newFiles.length, '개 파일');
    
    if (newFiles.length === 0) {
        showStatus('이미지 파일만 업로드 가능합니다.', 'error');
        return;
    }

    selectedFiles = [...selectedFiles, ...newFiles];
    console.log('전체 선택된 파일:', selectedFiles.length, '개');
    updatePreview();
    processBtn.disabled = false;
    showStatus('', '');
}

// 미리보기 업데이트
function updatePreview() {
    console.log('미리보기 업데이트:', selectedFiles.length, '개');
    previewContainer.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        previewContainer.style.display = 'none';
        countBadge.style.display = 'none';
        return;
    }

    previewContainer.style.display = 'block';
    countBadge.style.display = 'block';
    fileCount.textContent = selectedFiles.length;

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${e.target.result}" alt="Preview" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22>📄</text></svg>'">
                <div class="preview-info">
                    <div class="preview-name">${file.name}</div>
                    <div class="preview-size">${(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button class="remove-btn" data-index="${index}">삭제</button>
            `;
            previewContainer.appendChild(item);

            // 삭제 버튼 이벤트
            item.querySelector('.remove-btn').addEventListener('click', () => {
                removeFile(index);
            });
        };
        reader.readAsDataURL(file);
    });
}

// 파일 삭제
function removeFile(index) {
    console.log('파일 삭제:', index);
    selectedFiles.splice(index, 1);
    updatePreview();
    
    if (selectedFiles.length === 0) {
        processBtn.disabled = true;
    }
}

// OCR 처리
processBtn.addEventListener('click', async () => {
    console.log('=== OCR 처리 시작 ===');
    console.log('선택된 파일 수:', selectedFiles.length);
    
    if (selectedFiles.length === 0) {
        console.log('파일이 없어서 종료');
        return;
    }

    // Tesseract 확인
    if (typeof Tesseract === 'undefined') {
        console.error('❌ Tesseract가 정의되지 않음!');
        showStatus('❌ Tesseract.js가 로드되지 않았습니다. Console을 확인하세요.', 'error');
        alert('Tesseract.js 라이브러리가 로드되지 않았습니다.\n\ntesseract.min.js 파일을 scripts 폴더에 다운로드했는지 확인하세요.\n\n자세한 내용은 Console(F12)을 확인하세요.');
        return;
    }

    console.log('✅ Tesseract 확인됨');

    loading.style.display = 'block';
    status.style.display = 'none';
    processBtn.disabled = true;
    exportBtn.disabled = true;
    extractedData = [];

    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            console.log(`처리 중: ${i + 1}/${selectedFiles.length}`);
            showStatus(`처리 중... (${i + 1}/${selectedFiles.length})`, 'info');
            
            const file = selectedFiles[i];
            console.log('파일:', file.name, file.type);
            
            const imageData = await readFileAsDataURL(file);
            console.log('이미지 데이터 읽기 완료');
            
            const text = await performOCR(imageData);
            console.log('OCR 완료, 텍스트 길이:', text.length);
            
            const parsed = parseReceiptText(text);
            console.log('파싱 완료:', parsed);
            
            extractedData.push(parsed);
        }

        console.log('✅ 모든 파일 처리 완료');
        showStatus(`✅ ${selectedFiles.length}개 영수증 처리 완료!`, 'success');
        exportBtn.disabled = false;
    } catch (error) {
        console.error('❌ OCR 처리 오류:', error);
        showStatus(`❌ 오류: ${error.message}`, 'error');
        alert('OCR 처리 중 오류가 발생했습니다.\n\n' + error.message + '\n\nConsole(F12)에서 자세한 내용을 확인하세요.');
    } finally {
        loading.style.display = 'none';
        processBtn.disabled = false;
    }
});

// 파일을 DataURL로 읽기
function readFileAsDataURL(file) {
    console.log('파일 읽기 시작:', file.name);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('파일 읽기 완료');
            resolve(e.target.result);
        };
        reader.onerror = (e) => {
            console.error('파일 읽기 오류:', e);
            reject(e);
        };
        reader.readAsDataURL(file);
    });
}

// OCR 수행 (Worker 없이 직접 실행)
async function performOCR(imageData) {
    return await performOCRDirect(imageData);
}

// 영수증 텍스트 파싱
function parseReceiptText(text) {
    console.log('원본 텍스트:', text);
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    const data = {
        사용일자: '',
        사용항목: '',
        사용내역: '',
        사용처: '',
        사용금액: ''
    };

    // 날짜 패턴
    const datePatterns = [
        /(\d{4}[-./]\d{1,2}[-./]\d{1,2})/,
        /(\d{2}[-./]\d{1,2}[-./]\d{1,2})/,
        /(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/
    ];
    
    for (const line of lines) {
        for (const pattern of datePatterns) {
            const match = line.match(pattern);
            if (match) {
                data.사용일자 = match[1];
                break;
            }
        }
        if (data.사용일자) break;
    }

    // 금액 패턴
    const amountPatterns = [
        /합계[:\s]*([0-9,]+)/i,
        /총액[:\s]*([0-9,]+)/i,
        /결제[:\s]*([0-9,]+)/i,
        /금액[:\s]*([0-9,]+)/i,
        /([0-9,]{4,})\s*원/
    ];

    for (const line of lines) {
        for (const pattern of amountPatterns) {
            const match = line.match(pattern);
            if (match) {
                data.사용금액 = match[1].replace(/,/g, '');
                break;
            }
        }
        if (data.사용금액) break;
    }

    // 사용처 (상단 텍스트)
    if (lines.length > 0) {
        const topLines = lines.slice(0, Math.min(5, lines.length));
        const longestLine = topLines.reduce((a, b) => a.length > b.length ? a : b, '');
        data.사용처 = longestLine;
    }

    // 항목 및 내역
    const middleLines = lines.slice(1, Math.max(1, lines.length - 3));
    if (middleLines.length > 0) {
        data.사용항목 = middleLines[0] || '';
        data.사용내역 = middleLines.slice(0, 3).join(', ');
    }

    // 날짜가 없으면 현재 날짜
    if (!data.사용일자) {
        const today = new Date();
        data.사용일자 = today.toISOString().split('T')[0];
    }

    return data;
}

// CSV 내보내기
exportBtn.addEventListener('click', () => {
    console.log('CSV 내보내기 시작');
    if (extractedData.length === 0) {
        showStatus('처리된 데이터가 없습니다.', 'error');
        return;
    }

    const csv = convertToCSV(extractedData);
    downloadCSV(csv);
    showStatus('CSV 파일이 다운로드되었습니다!', 'success');
});

// CSV 변환
function convertToCSV(data) {
    const headers = ['사용일자', '사용항목', '사용내역', '사용처', '사용금액'];
    const rows = data.map(item => [
        item.사용일자,
        item.사용항목,
        item.사용내역,
        item.사용처,
        item.사용금액
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return '\uFEFF' + csvContent;
}

// CSV 다운로드
function downloadCSV(csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `영수증_${today}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// 초기화
clearBtn.addEventListener('click', () => {
    console.log('초기화');
    selectedFiles = [];
    extractedData = [];
    fileInput.value = '';
    updatePreview();
    processBtn.disabled = true;
    exportBtn.disabled = true;
    showStatus('', '');
});

// 상태 메시지 표시
function showStatus(message, type) {
    if (!message) {
        status.style.display = 'none';
        return;
    }
    
    status.textContent = message;
    status.className = `status ${type}`;
}

// 초기 상태 체크
setTimeout(() => {
    if (typeof Tesseract === 'undefined') {
        console.error('❌ Tesseract가 로드되지 않았습니다!');
        showStatus('⚠️ Tesseract.js를 다운로드해야 합니다!', 'error');
    } else {
        console.log('✅ Tesseract 라이브러리 로드 완료 (Worker 없이 실행)');
        showStatus('✅ 준비 완료! 영수증을 업로드하세요.', 'success');
        setTimeout(() => showStatus('', ''), 3000);
    }
}, 500);
