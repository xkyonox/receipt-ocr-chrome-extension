# 영수증 OCR Chrome 확장 프로그램 - 설치 가이드

## 📦 두 가지 버전

이 프로그램은 두 가지 버전으로 제공됩니다:

### 1. Tesseract.js 버전 (무료, 오프라인)
- ✅ 완전 무료
- ✅ API 키 불필요
- ✅ 최초 다운로드 후 오프라인 사용 가능
- ⚠️ 인식률이 다소 낮을 수 있음

### 2. Google Cloud Vision API 버전 (유료, 고정밀)
- ✅ 높은 인식률
- ✅ 한글 인식 우수
- ⚠️ Google Cloud API 키 필요
- ⚠️ 사용량에 따라 비용 발생 (월 1000건까지 무료)

## 🚀 설치 방법

### 공통 단계

1. **파일 다운로드**
   - 전체 `receipt-ocr-extension` 폴더를 다운로드합니다

2. **Chrome 확장 프로그램 설치**
   ```
   1. Chrome 브라우저 실행
   2. 주소창에 chrome://extensions/ 입력
   3. 우측 상단 "개발자 모드" 활성화
   4. "압축해제된 확장 프로그램을 로드합니다" 클릭
   5. receipt-ocr-extension 폴더 선택
   ```

### Tesseract.js 버전 설정

**방법 1: 자동 설치 (권장)**
```bash
cd receipt-ocr-extension
chmod +x download-tesseract.sh
./download-tesseract.sh
```

**방법 2: 수동 설치**
1. https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js 접속
2. 우클릭 > "다른 이름으로 저장"
3. `receipt-ocr-extension/scripts/tesseract.min.js`로 저장

**popup.html 수정**
- 이미 기본 설정되어 있습니다 (변경 불필요)

### Google Vision API 버전 설정

**1단계: Google Cloud 프로젝트 생성**
1. https://console.cloud.google.com/ 접속
2. 새 프로젝트 생성
3. "API 및 서비스" > "라이브러리" 선택
4. "Cloud Vision API" 검색 후 사용 설정

**2단계: API 키 생성**
1. "사용자 인증 정보" 메뉴
2. "+ 사용자 인증 정보 만들기" > "API 키"
3. API 키 복사

**3단계: popup.html 수정**
```html
<!-- 기존 줄을 찾아서 -->
<script src="scripts/popup.js"></script>

<!-- 다음으로 변경 -->
<script src="scripts/popup-vision-api.js"></script>
```

**4단계: 확장 프로그램에서 API 키 입력**
- 확장 프로그램 실행 시 API 키 입력 프롬프트가 나타남
- 한 번 입력하면 저장됨

## 🔧 파일 구조

```
receipt-ocr-extension/
├── manifest.json                      # 확장 프로그램 설정
├── popup.html                         # UI
├── README.md                          # 프로젝트 개요
├── INSTALLATION.md                    # 이 파일
├── download-tesseract.sh              # 라이브러리 다운로드 스크립트
├── icons/                             # 아이콘 파일
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── scripts/
    ├── popup.js                       # Tesseract 버전
    ├── popup-vision-api.js            # Vision API 버전
    └── tesseract.min.js              # OCR 라이브러리 (다운로드 필요)
```

## 📝 버전 선택 가이드

### Tesseract.js를 선택해야 하는 경우:
- 무료로 사용하고 싶을 때
- 개인적인 용도로 소량의 영수증 처리
- 오프라인 사용이 필요할 때
- 인식률이 완벽하지 않아도 괜찮을 때

### Google Vision API를 선택해야 하는 경우:
- 높은 정확도가 필요할 때
- 비즈니스 용도로 많은 영수증 처리
- 한글 영수증이 많을 때
- 월 1000건 이하 사용 (무료 범위)

## 💰 비용 정보 (Google Vision API)

- **무료 할당량**: 월 1,000건
- **추가 비용**: 1,000건당 $1.50
- **예시**:
  - 월 500건 사용: $0 (무료)
  - 월 2,000건 사용: $1.50
  - 월 5,000건 사용: $6.00

## 🐛 문제 해결

### "Tesseract is not defined" 오류
```bash
# 해결 방법
cd receipt-ocr-extension/scripts
# 위의 수동 설치 방법으로 tesseract.min.js 다운로드
```

### "API key not valid" 오류
```
1. Google Cloud Console에서 API 키 확인
2. Cloud Vision API가 활성화되었는지 확인
3. 결제 정보가 등록되었는지 확인 (무료 할당량 사용에도 필요)
4. Chrome 확장 프로그램에서 API 키 재입력
```

### OCR 인식이 잘 안 됨
```
영수증 촬영 팁:
1. 밝은 곳에서 촬영
2. 정면에서 촬영 (기울어지지 않게)
3. 고해상도로 촬영
4. 흔들림 없이 선명하게
5. 구겨진 영수증은 펴서 촬영
```

### CSV 다운로드가 안 됨
```
1. Chrome 팝업 차단 해제
2. 다운로드 권한 확인
3. 다운로드 폴더 권한 확인
```

## 🔄 업데이트 방법

```bash
# 새 버전 다운로드 후
1. chrome://extensions/ 접속
2. 영수증 OCR 확장 프로그램 찾기
3. "새로고침" 버튼 클릭
```

## 📞 지원

문제가 계속되면:
1. Chrome 개발자 도구(F12) > Console 탭에서 오류 확인
2. manifest.json의 version을 확인
3. 확장 프로그램 제거 후 재설치

## 🎯 테스트 방법

1. **간단한 영수증으로 테스트**
   - 편의점 영수증처럼 간단한 것부터 시작
   - 텍스트가 명확한 영수증 사용

2. **결과 확인**
   - CSV 파일 열어서 데이터 확인
   - 필요시 수동으로 보정

3. **대량 처리 테스트**
   - 5-10장의 영수증으로 동시 처리 테스트
   - 처리 시간 확인

## 🚀 다음 단계

설치가 완료되었다면:
1. 테스트용 영수증 몇 장 준비
2. 확장 프로그램 실행
3. 영수증 업로드 및 처리
4. CSV 파일 확인
5. 필요시 n8n/Zapier와 연동

## 💡 팁

- **첫 실행 시**: OCR 언어 모델 다운로드로 1-2분 소요될 수 있음
- **정기적 사용**: 인식 패턴을 파악하여 촬영 품질 개선
- **백업**: 원본 영수증 이미지도 함께 보관 권장
