# 🐛 디버그 가이드 - OCR이 작동하지 않을 때

## 🔍 문제 진단 방법

### 1단계: 개발자 도구 열기

1. **확장 프로그램 팝업 열기**
   - Chrome 우측 상단 확장 프로그램 아이콘 클릭
   - "영수증 OCR & CSV 변환기" 클릭

2. **개발자 도구 열기**
   - 팝업 창 내부에서 **우클릭**
   - "검사" 또는 "Inspect" 선택
   - 새 창이 열리면서 Console 탭 표시됨

3. **콘솔 확인**
   ```
   === 영수증 OCR 확장 프로그램 초기화 ===
   Tesseract 로드: ✅ 또는 ❌
   heic2any 로드: ✅ 또는 ⚠️
   ```

---

## ❌ 문제 1: "Tesseract 로드: ❌"

### 원인
`tesseract.min.js` 파일이 없거나 로드 실패

### 해결 방법

#### 방법 1: 파일 확인
```bash
# 터미널에서 확인
cd receipt-ocr-extension/scripts
ls -lh tesseract.min.js

# 예상 결과: 약 66KB
# 만약 파일이 없거나 크기가 1KB 미만이면 다운로드 필요
```

#### 방법 2: 수동 다운로드
1. https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js 접속
2. 페이지 내용 전체 복사 (Ctrl+A, Ctrl+C)
3. 텍스트 에디터에 붙여넣기
4. `receipt-ocr-extension/scripts/tesseract.min.js`로 저장
5. Chrome에서 확장 프로그램 새로고침 (🔄)

#### 방법 3: 자동 다운로드 (Mac/Linux)
```bash
cd receipt-ocr-extension
./download-tesseract.sh
```

#### 방법 4: curl로 직접 다운로드
```bash
cd receipt-ocr-extension/scripts
curl -L -o tesseract.min.js https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
```

### 확인
```
1. 파일 크기 확인: 66KB 정도여야 함
2. Chrome에서 확장 프로그램 새로고침
3. 팝업 다시 열기
4. Console에서 "Tesseract 로드: ✅" 확인
```

---

## ⚠️ 문제 2: "heic2any 로드: ⚠️"

### 이것은 오류가 아닙니다!
- JPG/PNG 파일은 정상 작동합니다
- HEIC 파일만 사용할 수 없습니다

### HEIC 지원이 필요한 경우에만 해결

#### 다운로드 방법
```bash
cd receipt-ocr-extension/scripts
curl -L -o heic2any.min.js https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js
```

또는 수동:
1. https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js
2. 내용 복사 → 저장

---

## 🔴 문제 3: "OCR 처리" 버튼 클릭 시 반응 없음

### 체크리스트

#### 1. Tesseract 로드 확인
```
Console 확인:
Tesseract 로드: ✅  ← 이게 있어야 함
```

#### 2. 파일 업로드 확인
```
- 파일이 미리보기에 표시되나요?
- "선택된 파일: X개" 배지가 보이나요?
- "OCR 처리" 버튼이 활성화(파란색)되었나요?
```

#### 3. 오류 메시지 확인
```
Console 탭에서 빨간색 오류 메시지 확인
```

### 일반적인 오류와 해결

#### 오류: "Tesseract is not defined"
```
→ tesseract.min.js 다운로드 필요
→ 위의 "문제 1" 해결 방법 참고
```

#### 오류: "Failed to fetch"
```
→ 인터넷 연결 확인
→ 첫 실행 시 OCR 언어 모델 다운로드 필요 (약 20MB)
→ 방화벽 확인
```

#### 오류: "Cannot read properties of undefined"
```
→ Chrome 확장 프로그램 새로고침
→ 또는 재설치
```

---

## 🧪 테스트 방법

### 단계별 테스트

#### 테스트 1: 라이브러리 확인
```javascript
// Console에 입력
typeof Tesseract
// 결과: "object" 또는 "function" → ✅ 정상
// 결과: "undefined" → ❌ 다운로드 필요
```

#### 테스트 2: 간단한 이미지로 테스트
```
1. 아주 간단한 JPG 이미지 준비 (텍스트가 명확한 것)
2. 업로드
3. OCR 처리
4. Console에서 로그 확인
```

#### 테스트 3: 수동 OCR 테스트
```javascript
// Console에 입력
Tesseract.recognize(
  'https://tesseract.projectnaptha.com/img/eng_bw.png',
  'eng'
).then(({ data: { text } }) => console.log(text))

// 텍스트가 출력되면 ✅ Tesseract 정상 작동
```

---

## 📋 전체 체크리스트

설치 확인:
- [ ] `receipt-ocr-extension/scripts/tesseract.min.js` 존재 (66KB)
- [ ] `receipt-ocr-extension/manifest.json` 존재
- [ ] `receipt-ocr-extension/popup.html` 존재
- [ ] `receipt-ocr-extension/icons/` 폴더 존재

Chrome 설정:
- [ ] chrome://extensions/ 에서 확장 프로그램 보임
- [ ] 오류 없이 로드됨
- [ ] 개발자 모드 ON

실행 확인:
- [ ] 팝업이 열림
- [ ] Console에서 "Tesseract 로드: ✅" 표시
- [ ] 파일 업로드 가능
- [ ] OCR 처리 버튼 활성화

---

## 🆘 여전히 안 되면?

### 완전 재설치

```bash
# 1. 기존 제거
chrome://extensions/ → 확장 프로그램 제거

# 2. 폴더 삭제
rm -rf receipt-ocr-extension

# 3. 새로 다운로드
ZIP 파일 새로 다운로드 및 압축 해제

# 4. 라이브러리 다운로드
cd receipt-ocr-extension/scripts
curl -L -o tesseract.min.js https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js

# 5. 재설치
chrome://extensions/ → 폴더 로드
```

### Console 로그 공유

문제가 계속되면 다음 정보를 공유해주세요:

```
1. Console 탭의 모든 메시지 (빨간색 오류 포함)
2. Network 탭에서 실패한 요청
3. 파일 목록:
   ls -lh receipt-ocr-extension/scripts/
```

---

## 💡 예방 팁

### 올바른 설치 순서
```
1. ZIP 압축 해제
2. tesseract.min.js 다운로드 (필수!)
3. Chrome에 설치
4. 팝업 열기
5. Console 확인
6. 테스트
```

### 자주 확인하기
```
- Chrome 업데이트 확인
- 확장 프로그램 새로고침
- Console 로그 모니터링
```

### 백업
```
작동하는 버전을 찾으면:
- 전체 폴더 백업
- tesseract.min.js 따로 보관
```

---

이 가이드로 문제를 해결하세요! 🚀
