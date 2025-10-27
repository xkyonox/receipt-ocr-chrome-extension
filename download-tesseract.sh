#!/bin/bash

echo "🔽 Tesseract.js 라이브러리 다운로드 중..."

# scripts 디렉토리로 이동
cd "$(dirname "$0")/scripts"

# wget 또는 curl 사용
if command -v wget &> /dev/null; then
    wget -O tesseract.min.js https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
elif command -v curl &> /dev/null; then
    curl -L -o tesseract.min.js https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
else
    echo "❌ wget 또는 curl이 필요합니다."
    echo "수동으로 다운로드하세요:"
    echo "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"
    exit 1
fi

if [ -f "tesseract.min.js" ]; then
    echo "✅ Tesseract.js 다운로드 완료!"
    echo "📦 파일 크기: $(du -h tesseract.min.js | cut -f1)"
else
    echo "❌ 다운로드 실패"
    exit 1
fi
