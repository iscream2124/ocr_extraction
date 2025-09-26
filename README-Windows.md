# 🪟 MinerU GUI - 윈도우 실행 가이드

윈도우에서 MinerU GUI를 실행하는 방법을 안내합니다.

## 🚀 빠른 시작

### 방법 1: 배치 파일 실행 (가장 쉬움)
```cmd
run-windows.bat
```
더블클릭하거나 명령 프롬프트에서 실행

### 방법 2: PowerShell 실행
```powershell
.\run-windows.ps1
```

### 방법 3: 직접 실행
```cmd
npm start
```

## 📋 사전 요구사항

### 1. Node.js 설치
- [Node.js 공식 사이트](https://nodejs.org)에서 다운로드
- LTS 버전 권장 (v18 이상)
- 설치 시 "Add to PATH" 옵션 체크

### 2. Python 설치
- [Python 공식 사이트](https://python.org)에서 다운로드
- Python 3.8 이상 권장
- 설치 시 "Add Python to PATH" 옵션 체크

### 3. MinerU 설치
```cmd
pip install -U "mineru[core]"
```

## 🛠️ 설치 및 실행

### 1. 프로젝트 다운로드
```cmd
git clone <repository-url>
cd ocr_extraction
```

### 2. 의존성 설치
```cmd
npm install
```

### 3. 실행
```cmd
npm start
```

## 📦 실행 파일 생성

### 개발자용 빌드
```cmd
npm run build
```

### 배포용 패키지 생성
```cmd
npm run dist
```

생성된 파일들:
- `dist/win-unpacked/` - 압축 해제된 앱
- `dist/MinerU GUI Setup.exe` - 설치 프로그램
- `dist/MinerU GUI.exe` - 포터블 실행 파일

## 🎯 사용법

1. **파일 선택**
   - "파일" 버튼: 개별 파일 선택
   - "폴더" 버튼: 폴더 선택

2. **출력 설정**
   - "선택" 버튼: 출력 디렉토리 선택

3. **옵션 설정**
   - 처리 방법, 백엔드, 언어, 디바이스 선택
   - 수식/표 처리 옵션 체크

4. **처리 실행**
   - "OCR 처리 시작" 버튼 클릭
   - 실시간 로그 확인

## ⌨️ 키보드 단축키

- **Ctrl + Enter**: OCR 처리 시작
- **Escape**: 처리 중지
- **Ctrl + L**: 로그 지우기

## 🔧 문제 해결

### Node.js 관련 오류
```cmd
# Node.js 버전 확인
node --version

# npm 캐시 정리
npm cache clean --force

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### Python 관련 오류
```cmd
# Python 버전 확인
python --version

# pip 업그레이드
python -m pip install --upgrade pip

# MinerU 재설치
pip uninstall mineru
pip install -U "mineru[core]"
```

### Electron 앱이 실행되지 않는 경우
```cmd
# Electron 재설치
npm uninstall electron
npm install electron@latest

# 또는 특정 버전 설치
npm install electron@32.0.0
```

### 파일 선택이 안 되는 경우
- 파일 경로에 한글이나 특수문자가 있는지 확인
- 파일 권한 확인
- 바이러스 백신 프로그램이 차단하는지 확인

## 📁 지원 파일 형식

- **PDF**: `.pdf`
- **이미지**: `.png`, `.jpg`, `.jpeg`

## 🎨 UI 특징

- 현대적인 Material Design
- 반응형 레이아웃
- 다크 테마 로그 창
- 실시간 진행률 표시
- 키보드 단축키 지원

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Node.js와 Python이 올바르게 설치되었는지
2. MinerU가 정상적으로 설치되었는지
3. 파일 경로에 특수문자가 없는지
4. 바이러스 백신이 차단하지 않는지

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능
