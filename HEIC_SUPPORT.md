# 📱 HEIC 파일 지원 가이드

## HEIC 파일이란?

HEIC (High Efficiency Image Container)는 Apple 기기(iPhone, iPad)에서 사용하는 이미지 포맷입니다.
- iOS 11 이상에서 기본 사진 형식
- JPG보다 파일 크기가 작으면서 화질 우수
- Android 및 Windows에서 기본 지원 안 됨

## ✨ 이 확장 프로그램의 HEIC 지원

이제 iPhone으로 촬영한 영수증 사진(HEIC)을 **자동으로 JPG로 변환**하여 처리합니다!

### 지원 기능
- ✅ HEIC 파일 자동 감지
- ✅ JPG로 자동 변환
- ✅ 변환 후 OCR 처리
- ✅ 다른 이미지 형식과 동일하게 작동

## 🚀 사용 방법

### 1. 라이브러리 설치

HEIC 지원을 위해 `heic2any` 라이브러리가 필요합니다.

**자동 설치 (권장):**
```bash
cd receipt-ocr-extension
./download-tesseract.sh
```
이 스크립트가 자동으로 다음 두 파일을 다운로드합니다:
- tesseract.min.js (OCR)
- heic2any.min.js (HEIC 변환)

**수동 설치:**
1. https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js 접속
2. 파일 다운로드
3. `receipt-ocr-extension/scripts/heic2any.min.js`로 저장

### 2. iPhone 사진 업로드

1. iPhone에서 영수증 촬영
2. 사진을 컴퓨터로 전송 (AirDrop, iCloud, 케이블 등)
3. Chrome 확장 프로그램에서 업로드
4. 자동으로 JPG로 변환되어 처리됨!

## 📸 iPhone에서 HEIC 사진 전송 방법

### 방법 1: AirDrop (Mac)
```
1. iPhone에서 사진 선택
2. 공유 버튼 → AirDrop
3. Mac 선택
4. 확장 프로그램에 드래그 앤 드롭
```

### 방법 2: iCloud Photos
```
1. iCloud.com 접속
2. Photos 앱 열기
3. 사진 다운로드
4. 확장 프로그램에 업로드
```

### 방법 3: USB 케이블 (Windows/Mac)
```
1. iPhone을 컴퓨터에 연결
2. 파일 탐색기/Finder에서 사진 복사
3. 확장 프로그램에 업로드
```

### 방법 4: 이메일/메시지
```
1. iPhone에서 사진을 이메일로 전송
2. 컴퓨터에서 이메일 열기
3. 첨부파일 다운로드
4. 확장 프로그램에 업로드
```

## 🔧 문제 해결

### "HEIC 파일 변환 실패" 오류

**원인**: heic2any.min.js 라이브러리가 없거나 손상됨

**해결 방법**:
```bash
cd receipt-ocr-extension/scripts
# heic2any.min.js 파일 확인
ls -la heic2any.min.js

# 없거나 용량이 1KB 미만이면 다시 다운로드
cd ..
./download-tesseract.sh
```

### HEIC 파일이 업로드되지 않음

**원인**: 파일 형식 인식 문제

**해결 방법**:
1. 파일 확장자가 `.heic` 또는 `.HEIC`인지 확인
2. Chrome 확장 프로그램 새로고침
3. 파일을 iPhone에서 "JPG로 저장" 후 업로드

### 변환이 너무 느림

**정상입니다!** 
- HEIC → JPG 변환은 시간이 걸립니다
- 파일당 2-5초 정도 소요
- "HEIC 파일 변환 중..." 메시지가 표시됨
- 인내심을 갖고 기다려주세요

## 💡 팁

### HEIC vs JPG 비교

| 항목 | HEIC | JPG |
|------|------|-----|
| 화질 | 우수 | 양호 |
| 파일 크기 | 작음 (50% 절약) | 큼 |
| 호환성 | 제한적 (Apple) | 범용 |
| 변환 시간 | 2-5초 | 즉시 |
| OCR 정확도 | 동일 | 동일 |

### iPhone 설정 변경 (선택사항)

HEIC 대신 JPG로 저장하려면:
```
iPhone 설정
→ 카메라
→ 포맷
→ "호환성 우선" 선택
```

이렇게 하면 처음부터 JPG로 저장되어 변환 불필요!

### 배치 처리 팁

여러 HEIC 파일을 한 번에 업로드하면:
- 모두 자동으로 변환됨
- 한 번에 10장 이하 권장 (메모리 절약)
- 변환 시간: 파일 수 × 2-5초

## 🎯 최적 워크플로우

### iPhone 사용자
```
1. iPhone으로 영수증 촬영 (HEIC)
2. AirDrop으로 Mac에 전송
3. Chrome 확장 프로그램에 드래그 앤 드롭
4. 자동 변환 → OCR → CSV 저장
```

### Android 사용자
```
1. Android로 영수증 촬영 (JPG)
2. 컴퓨터로 전송
3. Chrome 확장 프로그램에 업로드
4. OCR → CSV 저장 (변환 불필요)
```

## 📊 지원 파일 형식

이제 다음 형식을 모두 지원합니다:
- ✅ JPG / JPEG
- ✅ PNG
- ✅ HEIC / HEIF (iPhone)
- ✅ WebP
- ✅ GIF (첫 프레임만)

## 🔒 개인정보 보호

- 모든 HEIC 변환은 **로컬에서 처리**됩니다
- 파일이 서버로 전송되지 않습니다
- 브라우저 내에서만 변환됩니다
- 안전하게 사용 가능합니다!

## 🚀 성능 최적화

### 권장 사항
- 한 번에 10장 이하 업로드
- 고해상도 사진은 압축 권장 (5MB 이하)
- HEIC 변환 중에는 다른 작업 대기

### 시스템 요구사항
- Chrome 최신 버전
- 메모리: 4GB 이상 권장
- 인터넷 연결 (최초 1회, 라이브러리 다운로드용)

---

**이제 iPhone 영수증도 쉽게 처리할 수 있습니다!** 📱→💻→📊
