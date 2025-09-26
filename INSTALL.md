# 🚀 MinerU GUI 설치 가이드

윈도우, 맥, 리눅스에서 MinerU GUI를 설치하고 실행하는 방법을 안내합니다.

## 📋 사전 요구사항

### 모든 플랫폼 공통
- **Node.js 16.0.0 이상** ([다운로드](https://nodejs.org))
- **Python 3.8 이상** ([다운로드](https://python.org))
- **MinerU** (아래 설치 방법 참조)

## 🪟 Windows 설치

### 1. Node.js 설치
1. [Node.js 공식 사이트](https://nodejs.org) 방문
2. LTS 버전 다운로드
3. 설치 시 "Add to PATH" 옵션 체크

### 2. Python 설치
1. [Python 공식 사이트](https://python.org) 방문
2. 최신 버전 다운로드
3. 설치 시 "Add Python to PATH" 옵션 체크

### 3. MinerU 설치
```cmd
pip install -U "mineru[core]"
```

### 4. MinerU GUI 실행
```cmd
# 방법 1: 배치 파일 실행
run-windows.bat

# 방법 2: PowerShell 실행
.\run-windows.ps1

# 방법 3: 직접 실행
npm install
npm start
```

## 🍎 macOS 설치

### 1. Homebrew 설치 (선택사항)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Node.js 설치
```bash
# Homebrew 사용
brew install node

# 또는 공식 사이트에서 다운로드
# https://nodejs.org
```

### 3. Python 설치
```bash
# pyenv 사용 (권장)
brew install pyenv
pyenv install 3.12.6
pyenv global 3.12.6

# 또는 Homebrew 사용
brew install python
```

### 4. MinerU 설치
```bash
pip install -U "mineru[core]"
```

### 5. MinerU GUI 실행
```bash
# 방법 1: 스크립트 실행
./run.sh

# 방법 2: 직접 실행
npm install
npm start
```

## 🐧 Linux 설치

### 1. Node.js 설치
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

# 또는 공식 사이트에서 다운로드
# https://nodejs.org
```

### 2. Python 설치
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

### 3. MinerU 설치
```bash
pip3 install -U "mineru[core]"
```

### 4. MinerU GUI 실행
```bash
# 방법 1: 스크립트 실행
./run.sh

# 방법 2: 직접 실행
npm install
npm start
```

## 📦 실행 파일 생성

### 모든 플랫폼용 빌드
```bash
npm run build:all
```

### 플랫폼별 빌드
```bash
# Windows용
npm run build:win

# macOS용
npm run build:mac

# Linux용
npm run build:linux
```

## 🔧 문제 해결

### Node.js 관련
```bash
# 버전 확인
node --version
npm --version

# 캐시 정리
npm cache clean --force

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### Python 관련
```bash
# 버전 확인
python --version
# 또는
python3 --version

# pip 업그레이드
python -m pip install --upgrade pip

# MinerU 재설치
pip uninstall mineru
pip install -U "mineru[core]"
```

### Electron 관련
```bash
# Electron 재설치
npm uninstall electron
npm install electron@latest

# 또는 특정 버전
npm install electron@32.0.0
```

## 🎯 사용법

1. **파일 선택**: PDF, PNG, JPG, JPEG 파일 또는 폴더 선택
2. **출력 설정**: 결과를 저장할 디렉토리 선택
3. **옵션 설정**: 처리 방법, 언어, 디바이스 등 설정
4. **처리 실행**: OCR 처리 시작

## ⌨️ 키보드 단축키

- **Ctrl/Cmd + Enter**: OCR 처리 시작
- **Escape**: 처리 중지
- **Ctrl/Cmd + L**: 로그 지우기

## 📁 지원 파일 형식

- **PDF**: `.pdf`
- **이미지**: `.png`, `.jpg`, `.jpeg`

## 🆘 지원

문제가 발생하면 다음을 확인하세요:
1. Node.js와 Python이 올바르게 설치되었는지
2. MinerU가 정상적으로 설치되었는지
3. 파일 경로에 특수문자가 없는지
4. 바이러스 백신이 차단하지 않는지

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능
