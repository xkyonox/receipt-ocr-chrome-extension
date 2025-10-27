# CSP (Content Security Policy) 오류 해결 완료

## 문제 상황
```
Refused to load the script 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.1/dist/worker.min.js' 
because it violates the following Content Security Policy directive
```

## 원인
Chrome 확장 프로그램의 Content Security Policy(CSP)가 외부 CDN에서 worker 스크립트를 로드하는 것을 차단했습니다.

## 해결 방법

### 1. Tesseract Worker 초기화 방식 변경
- `Tesseract.recognize()` 직접 호출 → `createWorker()` 사용으로 변경
- Worker 설정을 명시적으로 제어하도록 수정

### 2. manifest.json CSP 설정 업데이트
```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; connect-src https://cdn.jsdelivr.net https://tessdata.projectnaptha.com https://unpkg.com"
}
```

**주요 변경점:**
- `script-src`: 'self'와 'wasm-unsafe-eval'만 허용 (WASM 사용 필수)
- `connect-src`: 외부 리소스 다운로드를 위한 연결 허용

### 3. popup-simple.js 주요 변경 사항

#### Worker 초기화 함수 추가
```javascript
let tesseractWorker = null;

async function initTesseract() {
    if (tesseractWorker) return tesseractWorker;
    
    tesseractWorker = await Tesseract.createWorker('kor+eng', 1, {
        workerPath: chrome.runtime.getURL('scripts/tesseract.min.js'),
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.0/tesseract-core.wasm.js',
        logger: m => console.log('Tesseract 로딩:', m)
    });
    
    return tesseractWorker;
}
```

#### OCR 실행 함수 수정
```javascript
async function performOCR(imageData) {
    const worker = await initTesseract();
    const result = await worker.recognize(imageData);
    return result.data.text;
}
```

## 사용 방법

1. **기존 확장 프로그램 제거**
   - Chrome 확장 프로그램 관리(`chrome://extensions/`)에서 기존 버전 삭제

2. **수정된 버전 설치**
   - 개발자 모드 활성화
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - `receipt-ocr-fixed` 폴더 선택

3. **확장 프로그램 실행**
   - 확장 프로그램 아이콘 클릭
   - "준비 중... Tesseract 초기화 중" 메시지 확인
   - "✅ 준비 완료!" 메시지가 나타나면 사용 가능

## 초기 실행 시 주의사항

- **첫 실행 시 언어 데이터 다운로드**가 필요합니다
- 약 10-20초 정도 소요될 수 있습니다
- 인터넷 연결이 필요합니다
- 다운로드 후에는 캐시되어 빠르게 실행됩니다

## 확인 방법

Console(F12)에서 다음 로그 확인:
```
✅ Tesseract 라이브러리 로드 완료
Tesseract 로딩: {...}
✅ Tesseract Worker 초기화 완료
✅ 준비 완료! 영수증을 업로드하세요.
```

## 문제 해결

### 여전히 CSP 오류가 발생하는 경우
1. Chrome을 완전히 재시작
2. 확장 프로그램을 완전히 제거 후 재설치
3. `chrome://extensions/`에서 "오류" 버튼 확인

### 언어 데이터 다운로드 실패
- 인터넷 연결 확인
- 방화벽/프록시 설정 확인
- 잠시 후 재시도

## 기술적 설명

### CSP가 필요한 이유
Chrome 확장 프로그램은 보안을 위해 CSP를 엄격하게 적용합니다. 외부 스크립트의 실행을 제한하여 악성 코드 주입을 방지합니다.

### Worker 사용 이유
Tesseract.js는 OCR 처리를 위해 Web Worker를 사용합니다. 이를 통해 메인 스레드를 차단하지 않고 백그라운드에서 무거운 작업을 수행할 수 있습니다.

### WASM (WebAssembly)
Tesseract의 핵심 OCR 엔진은 WASM으로 컴파일되어 있어 네이티브에 가까운 성능을 제공합니다. 'wasm-unsafe-eval'은 WASM 실행을 위해 필수입니다.
