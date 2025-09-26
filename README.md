# MinerU GUI - OCR 텍스트 추출 도구

Electron을 사용한 현대적이고 사용자 친화적인 MinerU GUI 애플리케이션입니다.

## ✨ 주요 기능

- **🎨 현대적인 UI**: Electron 기반의 아름답고 반응형 인터페이스
- **📁 파일/폴더 선택**: PDF, PNG, JPG, JPEG 파일 또는 폴더를 쉽게 선택
- **📤 출력 디렉토리 설정**: 추출된 텍스트를 저장할 디렉토리를 직관적으로 선택
- **⚙️ 다양한 처리 옵션**:
  - 처리 방법: auto, txt, ocr
  - 백엔드: pipeline, vlm-transformers, vlm-vllm-engine, vlm-http-client
  - 언어: 한국어, 중국어, 영어, 일본어 등 다양한 언어 지원
  - 디바이스: CPU, CUDA, MPS 등
  - 수식/표 처리 옵션
- **📊 실시간 모니터링**: 처리 과정을 실시간으로 확인
- **📈 진행상황 표시**: 시각적인 진행률 표시
- **⌨️ 키보드 단축키**: 효율적인 작업을 위한 단축키 지원

## 🚀 설치 및 실행

### 1. 요구사항
- **Node.js 16.0.0 이상** ([다운로드](https://nodejs.org))
- **Python 3.8 이상** ([다운로드](https://python.org))
- **MinerU 설치됨** (`pip install -U "mineru[core]"`)

### 2. 빠른 시작

#### 🪟 Windows
```cmd
# 배치 파일 실행 (가장 쉬움)
run-windows.bat

# 또는 PowerShell
.\run-windows.ps1

# 또는 직접 실행
npm install && npm start
```

#### 🍎 macOS
```bash
# 스크립트 실행
./run.sh

# 또는 직접 실행
npm install && npm start
```

#### 🐧 Linux
```bash
# 스크립트 실행
./run.sh

# 또는 직접 실행
npm install && npm start
```

### 3. 개발 모드
```bash
# DevTools 포함 실행
npm run dev
```

### 4. 실행 파일 생성
```bash
# 모든 플랫폼용 빌드
npm run build:all

# 플랫폼별 빌드
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🎯 사용법

### 1. 파일 선택
- **파일 버튼**: 개별 파일 선택
- **폴더 버튼**: 폴더 선택 (폴더 내 모든 지원 파일 처리)
- **직접 입력**: 파일 경로를 직접 입력

### 2. 출력 설정
- **선택 버튼**: 출력 디렉토리 선택
- **결과 폴더 열기**: 처리 완료 후 결과 폴더 자동 열기

### 3. 옵션 설정
- **처리 방법**: auto(자동), txt(텍스트 추출), ocr(OCR)
- **백엔드**: pipeline(일반적), vlm-transformers, vlm-vllm-engine(빠름), vlm-http-client(클라이언트)
- **언어**: 한국어, 중국어, 영어, 일본어 등
- **디바이스**: CPU, CUDA, MPS 등
- **수식/표 처리**: 체크박스로 활성화/비활성화

### 4. 처리 실행
- **OCR 처리 시작**: 처리를 시작합니다
- **중지**: 처리 중 중단할 수 있습니다
- **로그 지우기**: 로그를 초기화합니다

## ⌨️ 키보드 단축키

- **Ctrl/Cmd + Enter**: OCR 처리 시작
- **Escape**: 처리 중지
- **Ctrl/Cmd + L**: 로그 지우기

## 📁 지원 파일 형식

- **PDF 파일**: `.pdf`
- **이미지 파일**: `.png`, `.jpg`, `.jpeg`

## 🛠️ 개발

### 프로젝트 구조
```
mineru-gui/
├── main.js          # Electron 메인 프로세스
├── preload.js       # 보안 컨텍스트 브리지
├── index.html       # UI 구조
├── styles.css       # 스타일시트
├── renderer.js      # 렌더러 프로세스 로직
├── package.json     # 프로젝트 설정
└── README.md        # 문서
```

### 빌드
```bash
# 배포용 빌드
npm run build

# 배포 패키지 생성
npm run dist
```

## 🔧 문제 해결

### Electron 앱이 실행되지 않는 경우
```bash
# Node.js 버전 확인
node --version

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### MinerU가 실행되지 않는 경우
```bash
# pyenv 환경 확인
eval "$(pyenv init -)"
python --version

# MinerU 설치 확인
python -c "import mineru; print('MinerU 설치됨')"
```

### 파일 선택이 안 되는 경우
- 파일 형식이 지원되는지 확인하세요
- 파일 경로에 특수 문자가 없는지 확인하세요
- 파일 권한을 확인하세요

## 📝 예시

### PDF 파일에서 텍스트 추출
1. **파일** 버튼 클릭 → `document.pdf` 선택
2. **선택** 버튼 클릭 → `./output` 디렉토리 선택
3. 처리 방법: `auto`, 언어: `korean` 설정
4. **OCR 처리 시작** 버튼 클릭

### 이미지 파일 OCR
1. **파일** 버튼 클릭 → `image.png` 선택
2. **선택** 버튼 클릭 → `./ocr_result` 디렉토리 선택
3. 처리 방법: `ocr`, 언어: `korean` 설정
4. **OCR 처리 시작** 버튼 클릭

## 🎨 UI 특징

- **그라데이션 배경**: 아름다운 그라데이션 배경
- **글래스모피즘**: 반투명 효과와 블러 처리
- **반응형 디자인**: 다양한 화면 크기에 최적화
- **다크 테마 로그**: 터미널 스타일의 로그 창
- **애니메이션**: 부드러운 전환 효과
- **아이콘**: Font Awesome 아이콘 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. MinerU의 라이선스도 확인해주세요.

## 🤝 기여

버그 리포트나 기능 제안은 언제든 환영합니다!
