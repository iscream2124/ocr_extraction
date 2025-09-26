#!/bin/bash
# MinerU GUI - 크로스 플랫폼 실행 스크립트

echo "MinerU GUI - OCR 텍스트 추출 도구"
echo "=================================="
echo ""

# 운영체제 확인
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
fi

echo "운영체제: $OS"
echo ""

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "❌ 오류: Node.js가 설치되지 않았습니다."
    echo "https://nodejs.org 에서 Node.js를 다운로드하여 설치하세요."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js 버전: $NODE_VERSION"

# Python 설치 확인
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "⚠️  경고: Python이 설치되지 않았습니다."
    echo "MinerU를 사용하려면 Python이 필요합니다."
    echo ""
else
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
    else
        PYTHON_VERSION=$(python --version)
    fi
    echo "✅ Python 버전: $PYTHON_VERSION"
fi

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성을 설치하는 중..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 오류: 의존성 설치에 실패했습니다."
        exit 1
    fi
fi

# MinerU 설치 확인
echo "🔍 MinerU 설치 확인 중..."
if command -v mineru &> /dev/null; then
    echo "✅ MinerU가 설치되어 있습니다."
else
    echo "⚠️  경고: MinerU가 설치되지 않았습니다."
    echo "다음 명령어로 설치하세요:"
    echo "pip install -U \"mineru[core]\""
    echo ""
fi

# Electron 앱 실행
echo "🚀 MinerU GUI를 시작하는 중..."
echo ""

# 플랫폼별 환경 설정
if [[ "$OS" == "macos" ]]; then
    # macOS에서 pyenv 환경 설정
    if [ -d "$HOME/.pyenv" ]; then
        export PATH="$HOME/.pyenv/shims:$PATH"
        echo "✅ pyenv 환경이 설정되었습니다."
    fi
fi

npm start
