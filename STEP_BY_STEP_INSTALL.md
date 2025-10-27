# 🚀 3분 완벽 설치 가이드

## 📥 1단계: 다운로드 및 압축 해제

1. `receipt-ocr-extension.zip` 다운로드
2. ZIP 파일 압축 해제
   - **Windows**: 우클릭 → "압축 풀기" → "여기에 풀기"
   - **Mac**: 더블 클릭
3. `receipt-ocr-extension` 폴더가 생성됨

### ⚠️ 중요: 폴더 확인

압축 해제 후 다음을 확인하세요:

```
📁 receipt-ocr-extension/
    📄 manifest.json        ← 이 파일이 보여야 함!
    📄 popup.html
    📁 icons/
    📁 scripts/
    📄 README.md
    ...
```

**만약 manifest.json이 보이지 않으면:**
- 폴더를 한 번 더 들어가보세요
- `receipt-ocr-extension` 안에 또 다른 폴더가 있을 수 있습니다

---

## 📚 2단계: 라이브러리 다운로드

### Windows 사용자

1. **PowerShell 열기**
   - `receipt-ocr-extension` 폴더에서 Shift + 우클릭
   - "PowerShell 창 여기에 열기" 선택

2. **스크립트 실행**
   ```powershell
   # 수동 다운로드 (Windows는 스크립트가 안 될 수 있음)
   # 아래 두 파일을 다운로드하세요:
   ```

3. **수동 다운로드**
   - 브라우저에서 다음 링크 열기:
     - https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
     - https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js
   
   - 각 파일을 다운로드하여:
     - `receipt-ocr-extension/scripts/tesseract.min.js`
     - `receipt-ocr-extension/scripts/heic2any.min.js`
     로 저장

### Mac/Linux 사용자

1. **터미널 열기**
   ```bash
   cd ~/Downloads/receipt-ocr-extension
   ```

2. **스크립트 실행**
   ```bash
   chmod +x download-tesseract.sh
   ./download-tesseract.sh
   ```

3. **완료 확인**
   ```bash
   ls -la scripts/
   # tesseract.min.js (약 66KB)
   # heic2any.min.js (약 50KB)
   # 두 파일이 있어야 함
   ```

---

## 🌐 3단계: Chrome에 설치

1. **Chrome 확장 프로그램 페이지 열기**
   - 주소창에 입력: `chrome://extensions/`
   - 또는: Chrome 메뉴 → 도구 더보기 → 확장 프로그램

2. **개발자 모드 활성화**
   - 우측 상단 "개발자 모드" 토글 ON

3. **확장 프로그램 로드**
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - 📁 폴더 선택 대화상자가 열림

4. **올바른 폴더 선택**
   ```
   ⚠️ 중요: receipt-ocr-extension 폴더를 선택하세요!
   
   ✅ 올바른 선택:
   Downloads/receipt-ocr-extension  (이 폴더!)
   
   ❌ 잘못된 선택:
   Downloads/  (상위 폴더 X)
   Downloads/files/receipt-ocr-extension/  (중간에 다른 폴더 X)
   ```

5. **설치 완료 확인**
   - "영수증 OCR & CSV 변환기" 카드가 나타남
   - 오류가 없으면 성공! 🎉

---

## ✅ 설치 확인

### 정상 설치 확인 방법

1. Chrome 우측 상단 확장 프로그램 아이콘 (퍼즐 모양) 클릭
2. "영수증 OCR & CSV 변환기" 찾기
3. 클릭하면 팝업 창 열림
4. 보라색 UI가 보이면 성공!

### 오류가 발생하면?

#### 오류 1: "Manifest file is missing"
→ **해결**: [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md) 참고
→ 올바른 폴더를 선택했는지 확인

#### 오류 2: "Could not load icon"
→ **해결**: icons 폴더 확인
→ icon16.png, icon48.png, icon128.png 있는지 확인

#### 오류 3: "Tesseract is not defined"
→ **해결**: 2단계 라이브러리 다운로드 다시 실행
→ scripts/tesseract.min.js 파일 확인

---

## 🎯 4단계: 첫 실행

1. **확장 프로그램 열기**
   - Chrome 우측 상단 퍼즐 아이콘
   - "영수증 OCR & CSV 변환기" 클릭

2. **테스트 이미지 업로드**
   - 영수증 사진 1장 준비
   - 드래그 앤 드롭 또는 클릭하여 업로드

3. **OCR 처리**
   - "OCR 처리" 버튼 클릭
   - 첫 실행 시 OCR 모델 다운로드 (1-2분 소요)
   - 처리 완료 메시지 확인

4. **CSV 저장**
   - "CSV 저장" 버튼 클릭
   - 다운로드 폴더에 `영수증_날짜.csv` 생성
   - 엑셀로 열어서 확인

---

## 📊 예상 소요 시간

| 단계 | 소요 시간 |
|------|-----------|
| 다운로드 & 압축 해제 | 30초 |
| 라이브러리 다운로드 | 1분 |
| Chrome 설치 | 30초 |
| 첫 실행 & 테스트 | 2분 |
| **총 시간** | **약 4분** |

---

## 💡 팁

### 빠른 액세스
- 확장 프로그램을 툴바에 고정:
  - 퍼즐 아이콘 클릭
  - 영수증 OCR 옆 📌 핀 아이콘 클릭
  - 이제 아이콘이 항상 보임!

### 키보드 단축키 설정
1. `chrome://extensions/shortcuts` 접속
2. "영수증 OCR & CSV 변환기" 찾기
3. 단축키 설정 (예: Ctrl+Shift+R)

### 여러 영수증 처리
- 한 번에 10장까지 업로드 가능
- Shift 키로 여러 파일 선택
- 드래그 앤 드롭으로 한 번에 추가

---

## 🆘 문제 해결

### 자주 하는 실수

1. **잘못된 폴더 선택**
   - 증상: "Manifest file is missing"
   - 해결: receipt-ocr-extension 폴더 직접 선택

2. **라이브러리 누락**
   - 증상: "Tesseract is not defined"
   - 해결: 2단계 다시 실행

3. **아이콘 누락**
   - 증상: "Could not load icon"
   - 해결: ZIP 파일 다시 압축 해제

4. **권한 문제**
   - 증상: 확장 프로그램이 작동하지 않음
   - 해결: Chrome 재시작

### 여전히 안 되나요?

1. **Chrome 업데이트**
   - Chrome 메뉴 → 도움말 → Chrome 정보
   - 최신 버전으로 업데이트

2. **전체 재설치**
   ```
   1. 확장 프로그램 제거
   2. receipt-ocr-extension 폴더 삭제
   3. ZIP 파일 다시 다운로드
   4. 1단계부터 다시 시작
   ```

3. **문서 확인**
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
   - [FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md)

---

## 🎉 설치 완료!

이제 iPhone 영수증(HEIC)부터 일반 사진까지 모두 처리할 수 있습니다!

**다음 단계:**
- [QUICKSTART.md](./QUICKSTART.md) - 5분 사용법
- [HEIC_SUPPORT.md](./HEIC_SUPPORT.md) - iPhone 영수증 처리
- [README.md](./README.md) - 전체 기능 안내
