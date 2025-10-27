// Google Cloud Vision API 사용 버전
// API 키가 필요합니다: https://console.cloud.google.com/apis/credentials

let selectedFiles = [];
let extractedData = [];

// API 키 설정 (사용자가 입력해야 함)
let GOOGLE_VISION_API_KEY = '';

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

// API 키 로드
chrome.storage.local.get(['visionApiKey'], (result) => {
    if (result.visionApiKey) {
        GOOGLE_VISION_API_KEY = result.visionApiKey;
    }
});

// 업로드 영역 클릭
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 파일 선택
fileInput.addEventListener('change', (e) => {
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
    handleFiles(e.dataTransfer.files);
});

// 파일 처리
function handleFiles(files) {
    const newFiles = Array.from(files);
    
    if (newFiles.length === 0) {
        showStatus('파일을 선택해주세요.', 'error');
        return;
    }

    // HEIC 파일 변환 후 추가
    processFiles(newFiles);
}

// HEIC 파일을 포함한 모든 파일 처리
async function processFiles(files) {
    const processedFiles = [];
    
    for (const file of files) {
        if (file.type === 'image/heic' || file.type === 'image/heif' || 
            file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
            
            // heic2any 라이브러리 확인
            if (typeof heic2any === 'undefined') {
                showStatus('HEIC 파일 지원을 위해 라이브러리가 필요합니다. README를 참고하세요.', 'error');
                console.error('heic2any 라이브러리가 로드되지 않았습니다.');
                return;
            }
            
            showStatus('HEIC 파일 변환 중...', 'info');
            
            try {
                // HEIC를 JPEG로 변환
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.9
                });
                
                // Blob을 File 객체로 변환
                const convertedFile = new File(
                    [convertedBlob], 
                    file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'),
                    { type: 'image/jpeg' }
                );
                
                processedFiles.push(convertedFile);
            } catch (error) {
                console.error('HEIC 변환 오류:', error);
                showStatus('HEIC 파일 변환 실패. JPG나 PNG로 변환 후 업로드해주세요.', 'error');
                return;
            }
        } else if (file.type.startsWith('image/')) {
            processedFiles.push(file);
        }
    }
    
    if (processedFiles.length === 0) {
        showStatus('이미지 파일만 업로드 가능합니다.', 'error');
        return;
    }

    selectedFiles = [...selectedFiles, ...processedFiles];
    updatePreview();
    processBtn.disabled = false;
    showStatus('', '');
}

// 미리보기 업데이트
function updatePreview() {
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
                <img src="${e.target.result}" alt="Preview">
                <div class="preview-info">
                    <div class="preview-name">${file.name}</div>
                    <div class="preview-size">${(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button class="remove-btn" data-index="${index}">삭제</button>
            `;
            previewContainer.appendChild(item);

            item.querySelector('.remove-btn').addEventListener('click', () => {
                removeFile(index);
            });
        };
        reader.readAsDataURL(file);
    });
}

// 파일 삭제
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
    
    if (selectedFiles.length === 0) {
        processBtn.disabled = true;
    }
}

// OCR 처리
processBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;

    // API 키 확인
    if (!GOOGLE_VISION_API_KEY) {
        const apiKey = prompt('Google Cloud Vision API 키를 입력하세요:\n\n(https://console.cloud.google.com/apis/credentials 에서 발급)');
        if (!apiKey) {
            showStatus('API 키가 필요합니다.', 'error');
            return;
        }
        GOOGLE_VISION_API_KEY = apiKey;
        chrome.storage.local.set({ visionApiKey: apiKey });
    }

    loading.style.display = 'block';
    status.style.display = 'none';
    processBtn.disabled = true;
    exportBtn.disabled = true;
    extractedData = [];

    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            showStatus(`처리 중... (${i + 1}/${selectedFiles.length})`, 'info');
            
            const file = selectedFiles[i];
            const base64 = await readFileAsBase64(file);
            const text = await performVisionOCR(base64);
            const parsed = parseReceiptText(text);
            
            extractedData.push(parsed);
        }

        showStatus(`✅ ${selectedFiles.length}개 영수증 처리 완료!`, 'success');
        exportBtn.disabled = false;
    } catch (error) {
        console.error('OCR 처리 오류:', error);
        if (error.message.includes('API')) {
            showStatus('API 키가 유효하지 않거나 할당량을 초과했습니다.', 'error');
            GOOGLE_VISION_API_KEY = '';
            chrome.storage.local.remove('visionApiKey');
        } else {
            showStatus('OCR 처리 중 오류가 발생했습니다.', 'error');
        }
    } finally {
        loading.style.display = 'none';
        processBtn.disabled = false;
    }
});

// 파일을 Base64로 읽기
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Google Vision API를 사용한 OCR
async function performVisionOCR(base64Image) {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;
    
    const requestBody = {
        requests: [{
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }],
            imageContext: {
                languageHints: ['ko', 'en']
            }
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responses[0].error) {
        throw new Error(data.responses[0].error.message);
    }

    const textAnnotation = data.responses[0].textAnnotations;
    return textAnnotation && textAnnotation.length > 0 ? textAnnotation[0].description : '';
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
