# 🚀 빠른 설치 가이드 (CSP 오류 수정 버전)

## ✅ 이 버전의 특징
- CSP(Content Security Policy) 오류 해결됨
- Worker 초기화 방식 개선
- 첫 실행 시 자동으로 Tesseract 초기화

## 📦 설치 단계

### 1. Tesseract.js 라이브러리 확인
확장 프로그램 폴더의 `scripts/tesseract.min.js` 파일이 있는지 확인하세요.

**파일이 없는 경우:**
```bash
cd receipt-ocr-fixed
chmod +x download-tesseract.sh
./download-tesseract.sh
```

또는 수동 다운로드:
- https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
- 위 파일을 `scripts/tesseract.min.js`로 저장

### 2. Chrome 확장 프로그램 설치

1. Chrome 브라우저에서 `chrome://extensions/` 열기
2. 우측 상단 **"개발자 모드"** 활성화
3. **"압축해제된 확장 프로그램을 로드합니다"** 클릭
4. `receipt-ocr-fixed` 폴더 선택
5. 설치 완료!

## 🎯 첫 실행

1. Chrome 우측 상단 확장 프로그램 아이콘 클릭
2. "영수증 OCR & CSV 변환기" 선택
3. **중요**: 다음 메시지를 확인하세요
   ```
   준비 중... Tesseract 초기화 중
   ```
   약 10-20초 대기 후:
   ```
   ✅ 준비 완료! 영수증을 업로드하세요.
   ```

4. 이제 사용 가능합니다!

## 🔍 정상 작동 확인

### Console 로그 (F12 → Console)
정상 작동 시 다음과 같은 로그가 표시됩니다:
```
=== 영수증 OCR 확장 프로그램 시작 ===
Tesseract 상태: function
✅ Tesseract 라이브러리 로드 완료
Tesseract Worker 초기화 시작...
Tesseract 로딩: {...}
✅ Tesseract Worker 초기화 완료
✅ 준비 완료! 영수증을 업로드하세요.
```

### ❌ CSP 오류가 없어야 함
이전 버전에서 나타났던 다음 오류가 없어야 합니다:
```
❌ Refused to load the script ... violates Content Security Policy
```

## 💡 사용 팁

### 효율적인 사용
1. 여러 영수증을 한 번에 업로드 (드래그 앤 드롭)
2. 처음 1개 영수증으로 테스트
3. 결과 확인 후 대량 처리

### 이미지 품질
- 밝은 조명에서 촬영
- 영수증 전체가 선명하게
- 배경은 단순하게

## 🐛 문제 발생 시

### 1. "준비 중..." 상태에서 멈춤
- 인터넷 연결 확인
- 방화벽/프록시 설정 확인
- Chrome 재시작

### 2. CSP 오류가 여전히 발생
```bash
# 완전히 제거 후 재설치
1. chrome://extensions/에서 확장 프로그램 "삭제"
2. Chrome 완전히 종료
3. Chrome 재실행
4. 확장 프로그램 재설치
```

### 3. OCR 인식이 안 됨
- F12 → Console 탭에서 오류 확인
- 이미지 파일 형식 확인 (JPG, PNG 권장)
- 파일 크기 확인 (너무 크면 압축)

## 📞 추가 도움말

- **상세 가이드**: [CSP_FIX_GUIDE.md](CSP_FIX_GUIDE.md)
- **전체 README**: [README.md](README.md)
- **문제 해결**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🎉 설치 완료!

이제 영수증을 업로드하고 OCR을 실행해보세요!
