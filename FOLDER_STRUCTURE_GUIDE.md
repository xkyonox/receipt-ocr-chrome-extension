# ⚠️ Chrome 확장 프로그램 설치 시 주의사항

## 일반적인 오류

### 오류: "Manifest file is missing or unreadable"

**원인**: 잘못된 폴더를 선택했습니다.

## ✅ 올바른 폴더 구조

다운로드 후 압축을 풀면 다음과 같은 구조여야 합니다:

```
Downloads/
└── receipt-ocr-extension/          ← 이 폴더를 선택!
    ├── manifest.json               ✅ 여기에 있어야 함
    ├── popup.html
    ├── icons/
    │   ├── icon16.png
    │   ├── icon48.png
    │   └── icon128.png
    └── scripts/
        ├── popup.js
        ├── popup-vision-api.js
        ├── tesseract.min.js
        └── heic2any.min.js
```

## ❌ 잘못된 예시

### 예시 1: 상위 폴더 선택
```
Downloads/
└── files/                          ❌ 이 폴더 말고!
    └── receipt-ocr-extension/      ← 이 폴더를 선택해야 함
        └── manifest.json
```

### 예시 2: 다운로드 폴더 직접 선택
```
Downloads/                          ❌ 이 폴더 말고!
├── receipt-ocr-extension/          ← 이 폴더를 선택해야 함
└── 기타 파일들...
```

## 🔧 해결 방법

### 단계별 가이드

1. **ZIP 파일 다운로드**
   - `receipt-ocr-extension.zip` 다운로드

2. **압축 해제**
   - Windows: 마우스 우클릭 → "압축 풀기"
   - Mac: 더블 클릭
   - 결과: `receipt-ocr-extension` 폴더 생성됨

3. **폴더 확인**
   ```
   receipt-ocr-extension 폴더 열기
   → manifest.json 파일이 바로 보여야 함!
   ```

4. **Chrome에서 선택**
   ```
   chrome://extensions/
   → "개발자 모드" ON
   → "압축해제된 확장 프로그램을 로드합니다" 클릭
   → receipt-ocr-extension 폴더 선택
     (manifest.json이 있는 폴더!)
   ```

## 🎯 확인 체크리스트

선택한 폴더에 다음 파일들이 **직접** 있어야 합니다:

- [ ] manifest.json (필수!)
- [ ] popup.html
- [ ] icons/ 폴더
- [ ] scripts/ 폴더

이 파일들이 보이지 않으면 **잘못된 폴더**를 선택한 것입니다!

## 💡 빠른 테스트 방법

### Windows
```cmd
dir receipt-ocr-extension\manifest.json
```
파일이 발견되면 ✅ 올바른 폴더!

### Mac/Linux
```bash
ls receipt-ocr-extension/manifest.json
```
파일이 발견되면 ✅ 올바른 폴더!

## 🔄 여전히 안 되면?

### 해결책 1: 다시 압축 해제
```
1. 기존 폴더 삭제
2. ZIP 파일 다시 압축 해제
3. receipt-ocr-extension 폴더 확인
```

### 해결책 2: 수동으로 확인
```
1. receipt-ocr-extension 폴더 열기
2. manifest.json 파일이 보이는지 확인
3. 안 보이면 하위 폴더 확인
4. manifest.json이 있는 폴더를 Chrome에 로드
```

### 해결책 3: 폴더 이름 변경
```
혹시 폴더 이름에 특수문자나 공백이 있으면:
"receipt-ocr-extension (1)" 
→ "receipt-ocr-extension" 으로 변경
```

## 📸 스크린샷 가이드

### ✅ 올바른 선택
```
Chrome 폴더 선택 대화상자에서:

📁 Downloads
  📁 receipt-ocr-extension      ← 이것 선택!
    📄 manifest.json            (폴더 안에 이게 보임)
    📄 popup.html
    📁 icons
    📁 scripts
```

### ❌ 잘못된 선택
```
Chrome 폴더 선택 대화상자에서:

📁 Downloads                    ← 이걸 선택하면 안 됨!
  📁 receipt-ocr-extension
  📁 다른 폴더들...

또는

📁 files                        ← 이것도 안 됨!
  📁 receipt-ocr-extension      (이 안쪽 폴더를 선택해야 함)
```

## 🎓 요약

**핵심**: Chrome에 로드할 폴더 안에 `manifest.json` 파일이 **직접** 있어야 합니다!

폴더 선택 후 `manifest.json`이 보이지 않으면 → 잘못된 폴더!

---

**여전히 문제가 있나요?**
폴더 구조 스크린샷을 확인하거나 다시 다운로드해보세요!
