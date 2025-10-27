# 📋 프로젝트 요약

## 프로젝트 개요
**영수증 OCR & CSV 변환 Chrome 확장 프로그램**

여러 영수증 사진을 업로드하여 자동으로 다음 정보를 추출하고 CSV 파일로 저장하는 Chrome 확장 프로그램입니다:
- 사용일자
- 사용항목
- 사용내역
- 사용처
- 사용금액

## 📁 생성된 파일 목록

```
receipt-ocr-extension/
├── 📄 manifest.json              # Chrome 확장 프로그램 설정
├── 📄 popup.html                 # 메인 UI (400x500px)
├── 📄 README.md                  # 프로젝트 전체 문서
├── 📄 INSTALLATION.md            # 상세 설치 가이드
├── 📄 QUICKSTART.md              # 5분 빠른 시작 가이드
├── 📄 PROJECT_SUMMARY.md         # 이 파일
├── 📄 download-tesseract.sh      # OCR 라이브러리 자동 다운로드 스크립트
├── 📁 icons/                     # 확장 프로그램 아이콘
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── 📁 scripts/                   # JavaScript 로직
    ├── popup.js                  # Tesseract.js 버전 (무료)
    └── popup-vision-api.js       # Google Vision API 버전 (고정밀)
```

## 🎯 주요 기능

### ✅ 구현된 기능
1. **다중 파일 업로드**
   - 클릭 또는 드래그 앤 드롭
   - 여러 영수증 동시 처리
   - 실시간 미리보기

2. **OCR 처리** (2가지 방식)
   - Tesseract.js: 무료, 오프라인
   - Google Vision API: 고정밀, 유료

3. **자동 데이터 파싱**
   - 날짜 추출 (다양한 형식 지원)
   - 금액 추출 (합계, 총액 등)
   - 사용처 추출 (상호명)
   - 항목 및 내역 정리

4. **CSV 내보내기**
   - UTF-8 BOM (엑셀 한글 호환)
   - 자동 날짜별 파일명
   - 즉시 다운로드

5. **사용자 친화적 UI**
   - 그라디언트 디자인
   - 진행 상황 표시
   - 상태 메시지
   - 파일별 삭제 기능

## 🚀 설치 방법 (간단 버전)

### 1. 필수: Tesseract.js 다운로드
```bash
cd receipt-ocr-extension
./download-tesseract.sh
```

### 2. Chrome에 설치
```
1. chrome://extensions/ 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. receipt-ocr-extension 폴더 선택
```

## 💻 기술 스택

| 구성요소 | 기술 |
|---------|------|
| 프레임워크 | Chrome Extension Manifest V3 |
| OCR (기본) | Tesseract.js 5.x (한글+영문) |
| OCR (고급) | Google Cloud Vision API |
| 언어 | HTML5, CSS3, JavaScript (ES6+) |
| 스타일 | CSS Gradient, Flexbox |
| 파일 처리 | FileReader API, Blob API |
| 데이터 저장 | Chrome Storage API |

## 📊 두 가지 OCR 버전 비교

| 항목 | Tesseract.js | Google Vision API |
|------|--------------|-------------------|
| 비용 | 무료 | 월 1000건 무료, 이후 유료 |
| 설치 | 간단 | API 키 필요 |
| 인식률 | 중간 (70-80%) | 높음 (90-95%) |
| 속도 | 느림 (3-5초/장) | 빠름 (1-2초/장) |
| 한글 | 보통 | 우수 |
| 오프라인 | 가능 | 불가능 |
| 권장 용도 | 개인 사용 | 비즈니스 |

## 🔄 워크플로우

```
1. 사용자 영수증 촬영 📸
   ↓
2. Chrome 확장 프로그램 업로드 ⬆️
   ↓
3. OCR 처리 (Tesseract 또는 Vision API) 🔍
   ↓
4. 텍스트 파싱 및 구조화 📋
   ↓
5. CSV 파일 생성 💾
   ↓
6. 다운로드 또는 자동화 연동 🔄
```

## 🌐 n8n/Zapier 연동 (선택사항)

확장 프로그램이 CSV를 생성하면, 자동화 도구와 연동 가능:

### n8n 예시
```
1. Watch Folder: 다운로드 폴더 모니터링
2. CSV Parser: 파일 읽기
3. Google Sheets: 데이터 추가
```

### Zapier 예시
```
Trigger: Gmail (CSV 첨부 메일)
Action: Google Sheets (행 추가)
```

## 🎨 UI 특징

- **색상 테마**: 보라색 그라디언트 (#667eea → #764ba2)
- **반응형**: 400px 너비 최적화
- **애니메이션**: 호버 효과, 로딩 스피너
- **접근성**: 명확한 상태 메시지, 시각적 피드백

## 📝 데이터 추출 로직

### 날짜 패턴
- `YYYY-MM-DD` (2024-10-27)
- `YYYY.MM.DD` (2024.10.27)
- `YY/MM/DD` (24/10/27)
- `YYYY년 MM월 DD일`

### 금액 패턴
- `합계: 10,000`
- `총액: 10,000`
- `결제: 10,000`
- `10,000원`

### 사용처
- 영수증 상단 최장 텍스트

### 항목/내역
- 중간 섹션 텍스트들

## ⚙️ 커스터마이징 포인트

1. **파싱 로직 개선**
   - `popup.js`의 `parseReceiptText()` 함수 수정
   - 정규표현식 패턴 추가/변경

2. **UI 변경**
   - `popup.html`의 CSS 스타일 수정
   - 색상, 크기, 레이아웃 조정

3. **CSV 포맷 변경**
   - `convertToCSV()` 함수에서 컬럼 추가/제거
   - 데이터 구조 변경

4. **다른 API 연동**
   - Azure Computer Vision
   - AWS Textract
   - Naver Clova OCR

## 🐛 알려진 제한사항

1. **인식률**: 손글씨는 인식 불가
2. **언어**: 한글/영문 위주 (다른 언어는 정확도 낮음)
3. **품질**: 저해상도 이미지는 정확도 하락
4. **구조**: 복잡한 레이아웃의 영수증은 파싱 어려움

## 🔮 향후 개선 사항

- [ ] AI 기반 항목 자동 분류 (식비, 교통비 등)
- [ ] 클라우드 저장소 직접 연동 (Drive, Dropbox)
- [ ] 영수증 이미지 전처리 (자동 회전, 보정)
- [ ] 모바일 앱 버전
- [ ] 다중 언어 지원 확대
- [ ] 실시간 협업 기능
- [ ] 대시보드 및 통계

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**제작**: Claude AI  
**날짜**: 2024-10-27  
**버전**: 1.0.0
