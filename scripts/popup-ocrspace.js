// OCR.space API 사용 버전 (무료)
// 무료 API 키: https://ocr.space/ocrapi

let selectedFiles = [];
let extractedData = [];

// OCR.space 무료 API 키 (테스트용)
// 사용자는 https://ocr.space/ocrapi 에서 자신의 키를 받을 수 있습니다
const OCR_SPACE_API_KEY = 'helloworld'; // 기본 무료 키

// 이미지 리사이즈 함수 (1MB 이하로)
async function resizeImage(file, maxSizeKB = 900) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                // Canvas 생성
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 원본 크기
                let width = img.width;
                let height = img.height;
                
                // 목표 파일 크기 (KB)
                const targetSize = maxSizeKB * 1024;
                
                // 크기 조정 비율 계산 (파일 크기 기준)
                const currentSize = file.size;
                if (currentSize <= targetSize) {
                    // 이미 충분히 작으면 원본 사용
                    resolve(file);
                    return;
                }
                
                // 파일 크기에 따른 리사이즈 비율
                const ratio = Math.sqrt(targetSize / currentSize);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
                
                // 최소 크기 보장 (OCR 정확도)
                const minWidth = 800;
                if (width < minWidth) {
                    const scale = minWidth / width;
                    width = minWidth;
                    height = Math.floor(height * scale);
                }
                
                console.log(`이미지 리사이즈: ${img.width}x${img.height} → ${width}x${height}`);
                
                // Canvas에 리사이즈된 이미지 그리기
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Blob으로 변환
                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log(`파일 크기: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
                        
                        // File 객체로 변환
                        const resizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        
                        resolve(resizedFile);
                    } else {
                        reject(new Error('이미지 변환 실패'));
                    }
                }, 'image/jpeg', 0.85); // JPEG 품질 85%
            };
            
            img.onerror = () => reject(new Error('이미지 로드 실패'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('파일 읽기 실패'));
        reader.readAsDataURL(file);
    });
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
console.log('=== 영수증 OCR 확장 프로그램 시작 (OCR.space API) ===');

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

// 파일 처리
function handleFiles(files) {
    console.log('handleFiles 호출됨:', files.length, '개 파일');
    
    const newFiles = Array.from(files).filter(file => {
        console.log('파일 타입:', file.type, '이름:', file.name);
        return file.type.startsWith('image/');
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
            
            const text = await performOCR(file);
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
        alert('OCR 처리 중 오류가 발생했습니다.\n\n' + error.message);
    } finally {
        loading.style.display = 'none';
        processBtn.disabled = false;
    }
});

// OCR 수행 (OCR.space API)
async function performOCR(file) {
    console.log('OCR.space API 호출 시작');
    
    try {
        // 파일 크기 확인 및 리사이즈
        let processFile = file;
        if (file.size > 900 * 1024) { // 900KB 이상이면
            console.log('파일이 큽니다. 리사이즈 중...');
            showStatus('이미지 최적화 중...', 'info');
            processFile = await resizeImage(file);
        }
        
        const formData = new FormData();
        formData.append('file', processFile);
        formData.append('apikey', OCR_SPACE_API_KEY);
        formData.append('language', 'kor'); // 한국어
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2'); // Engine 2 (더 정확)

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const result = await response.json();
        console.log('OCR.space 응답:', result);

        if (result.IsErroredOnProcessing) {
            throw new Error(result.ErrorMessage?.[0] || result.ErrorMessage || 'OCR 처리 실패');
        }

        if (!result.ParsedResults || result.ParsedResults.length === 0) {
            throw new Error('텍스트를 인식하지 못했습니다');
        }

        const text = result.ParsedResults[0].ParsedText;
        console.log('✅ OCR 완료');
        return text;
    } catch (error) {
        console.error('❌ OCR 오류:', error);
        throw error;
    }
}

// 영수증 텍스트 파싱
function parseReceiptText(text) {
    console.log('원본 텍스트:', text);
    
    const lines = text.split(/[\r\n]+/).map(line => line.trim()).filter(line => line);
    
    const data = {
        사용일자: '',
        사용항목: '',
        사용내역: '',
        사용처: '',
        사용금액: ''
    };

    // 날짜 패턴 개선 - 사업자등록번호 제외, 2025로 시작하는 날짜만
    for (const line of lines) {
        // 사업자번호 관련 줄은 건너뛰기
        if (/사업자|등록번호|법인|본점|지점/.test(line)) {
            continue;
        }
        
        // 2025-09-29, 2025.09.29, 2025/09/29 형식 (가장 우선)
        let match = line.match(/20\d{2}[-./]\d{2}[-./]\d{2}/);
        if (match) {
            data.사용일자 = match[0].replace(/\./g, '-').replace(/\//g, '-');
            break;
        }
        
        // 20250929 형식 (8자리 연속 숫자, 2025로 시작)
        match = line.match(/20\d{6}(?!\d)/);  // 뒤에 숫자가 더 없는 경우만
        if (match) {
            const dateStr = match[0];
            data.사용일자 = `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
            break;
        }
        
        // 2025년 09월 29일 형식
        match = line.match(/20\d{2}년\s*\d{1,2}월\s*\d{1,2}일/);
        if (match) {
            data.사용일자 = match[0]
                .replace(/년/g, '-')
                .replace(/월/g, '-')
                .replace(/일/g, '')
                .replace(/\s/g, '');
            break;
        }
    }

    // 금액 패턴 개선 (한국 영수증)
    const amountPatterns = [
        /[합계총액결제금액지불받을]\s*[:\s]*([0-9,]+)/i,
        /total\s*[:\s]*([0-9,]+)/i,
        /[카드현금]\s*[:\s]*([0-9,]+)/i,
        /^([0-9,]{5,})\s*$/  // 줄에 큰 숫자만 있는 경우
    ];

    // 가장 큰 금액을 찾기
    let maxAmount = 0;
    for (const line of lines) {
        for (const pattern of amountPatterns) {
            const match = line.match(pattern);
            if (match) {
                const amount = parseInt(match[1].replace(/,/g, ''));
                if (amount > maxAmount && amount < 10000000) { // 1000만원 이하
                    maxAmount = amount;
                    data.사용금액 = amount.toString();
                }
            }
        }
    }

    // 사용처 찾기 (상단 5줄 중 가장 긴 줄, 숫자/특수문자 적은 줄)
    if (lines.length > 0) {
        const topLines = lines.slice(0, Math.min(10, lines.length));
        
        // 점수 기반으로 상호명 찾기
        let bestLine = '';
        let bestScore = 0;
        
        for (const line of topLines) {
            if (line.length < 2 || line.length > 50) continue;
            
            let score = 0;
            
            // 한글이 많으면 가산점
            const koreanChars = (line.match(/[가-힣]/g) || []).length;
            score += koreanChars * 2;
            
            // 숫자가 많으면 감점
            const numbers = (line.match(/\d/g) || []).length;
            score -= numbers * 3;
            
            // 특수문자가 많으면 감점
            const special = (line.match(/[^가-힣a-zA-Z0-9\s]/g) || []).length;
            score -= special * 2;
            
            // 적당한 길이면 가산점
            if (line.length >= 3 && line.length <= 20) {
                score += 5;
            }
            
            // "점", "마트", "편의점" 등 키워드 있으면 가산점
            if (/[점편의마트스토어]/g.test(line)) {
                score += 10;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestLine = line;
            }
        }
        
        data.사용처 = bestLine || topLines[0];
    }

    // 주요 항목 찾기 (금액이 큰 품목들) - 사용내역은 빈 값으로
    const items = [];
    for (const line of lines) {
        // 품목명과 금액이 같이 있는 패턴
        const itemMatch = line.match(/([가-힣a-zA-Z\s]{2,20})\s+(\d+[,\d]*)\s+(\d+)\s+([0-9,]+)/);
        if (itemMatch) {
            const itemName = itemMatch[1].trim();
            const amount = parseInt(itemMatch[4].replace(/,/g, ''));
            if (amount > 1000 && itemName.length >= 2) {
                items.push({ name: itemName, amount: amount });
            }
        }
    }
    
    // 금액 순으로 정렬하여 상위 3개 추출
    items.sort((a, b) => b.amount - a.amount);
    const topItems = items.slice(0, 3);
    
    // 사용항목은 고정값
    data.사용항목 = '복리후생비(식대,음료 등)';
    
    // 사용내역은 빈 값
    data.사용내역 = '';


    // 날짜가 없으면 현재 날짜
    if (!data.사용일자) {
        const today = new Date();
        data.사용일자 = today.toISOString().split('T')[0];
    }
    
    // 날짜 포맷 정리
    if (data.사용일자) {
        data.사용일자 = data.사용일자.replace(/[-]{2,}/g, '-').replace(/^-|-$/g, '');
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
    const headers = ['사용 일자', '사용 항목', '사용 내역(+목적)', '사용처', '사용금액'];
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
    status.style.display = 'block';
}

// 초기 상태
setTimeout(() => {
    console.log('✅ OCR.space API 준비 완료');
    showStatus('✅ 준비 완료! 영수증을 업로드하세요.', 'success');
    setTimeout(() => showStatus('', ''), 3000);
}, 500);
