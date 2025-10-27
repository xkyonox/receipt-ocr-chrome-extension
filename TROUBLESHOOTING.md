# 🔧 문제 해결 가이드

## Chrome 확장 프로그램 설치 오류

### 오류: "Could not load icon 'icons/icon16.png'"

**원인**: 아이콘 파일이 없거나 손상됨

**해결 방법**:
1. `icons` 폴더가 존재하는지 확인
2. 다음 파일들이 있는지 확인:
   - `icons/icon16.png` (16x16 픽셀)
   - `icons/icon48.png` (48x48 픽셀)
   - `icons/icon128.png` (128x128 픽셀)
3. 폴더를 다시 다운로드하여 시도

### 오류: "Could not load manifest"

**원인**: manifest.json 파일 형식 오류

**해결 방법**:
1. `manifest.json` 파일이 루트 폴더에 있는지 확인
2. JSON 형식이 올바른지 확인 (쉼표, 중괄호 등)
3. UTF-8 인코딩 확인

### 오류: "Tesseract is not defined"

**원인**: Tesseract.js 라이브러리 파일이 없음

**해결 방법**:
```bash
# 방법 1: 자동 다운로드
cd receipt-ocr-extension
./download-tesseract.sh

# 방법 2: 수동 다운로드
# https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
# 다운로드 후 scripts/tesseract.min.js로 저장
```

## 올바른 폴더 구조

```
receipt-ocr-extension/          ← 이 폴더를 Chrome에 로드
├── manifest.json               ✅ 필수
├── popup.html                  ✅ 필수
├── icons/                      ✅ 필수
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/                    ✅ 필수
│   ├── popup.js
│   ├── popup-vision-api.js
│   └── tesseract.min.js        ⚠️ 다운로드 필요
├── README.md
├── INSTALLATION.md
├── QUICKSTART.md
└── download-tesseract.sh
```

## 설치 체크리스트

- [ ] `receipt-ocr-extension` 폴더 전체를 다운로드
- [ ] `icons` 폴더에 PNG 파일 3개 확인
- [ ] `manifest.json` 파일 존재 확인
- [ ] `popup.html` 파일 존재 확인
- [ ] `scripts/tesseract.min.js` 다운로드 (66KB)
- [ ] Chrome 개발자 모드 활성화
- [ ] "압축해제된 확장 프로그램을 로드합니다" 클릭
- [ ] `receipt-ocr-extension` **폴더** 선택 (파일 말고!)

## 자주 묻는 질문

### Q: 어떤 폴더를 선택해야 하나요?
**A**: `receipt-ocr-extension` 폴더 자체를 선택하세요. 내부의 파일들을 선택하는 것이 아닙니다!

### Q: 다운로드는 어디서 받나요?
**A**: Claude가 생성한 outputs 폴더에서 `receipt-ocr-extension` 폴더 전체를 다운로드하세요.

### Q: tesseract.min.js는 꼭 필요한가요?
**A**: 네! OCR 기능에 필수입니다. 없으면 "Tesseract is not defined" 오류가 발생합니다.

### Q: 확장 프로그램이 작동하지 않아요
**A**: 
1. Chrome 개발자 도구(F12) 열기
2. Console 탭에서 오류 확인
3. 오류 메시지를 참고하여 문제 해결

### Q: 아이콘이 깨져 보여요
**A**: 정상입니다! 아이콘 이미지가 작아서 그럴 수 있습니다. 기능에는 문제없습니다.

## 올바른 설치 과정 (스크린샷 순서)

1. **Chrome 설정**
   ```
   chrome://extensions/ 접속
   ```

2. **개발자 모드 활성화**
   ```
   우측 상단 토글 스위치 ON
   ```

3. **확장 프로그램 로드**
   ```
   "압축해제된 확장 프로그램을 로드합니다" 버튼 클릭
   ```

4. **폴더 선택**
   ```
   receipt-ocr-extension 폴더 선택
   (내부 파일이 아닌 폴더 자체!)
   ```

5. **설치 완료 확인**
   ```
   "영수증 OCR & CSV 변환기" 확장 프로그램이 목록에 표시됨
   ```

## 추가 도움이 필요하신가요?

- 폴더 구조 확인: `ls -la receipt-ocr-extension/`
- 아이콘 확인: `file receipt-ocr-extension/icons/*.png`
- Manifest 확인: `cat receipt-ocr-extension/manifest.json`

문제가 계속되면 전체 폴더를 다시 다운로드해보세요!
