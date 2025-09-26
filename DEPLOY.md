# 🚀 GitHub Pages 배포 가이드

MinerU OCR GUI를 GitHub Pages로 배포하는 방법을 안내합니다.

## 📋 사전 준비

1. **GitHub 계정**이 필요합니다
2. **Git**이 설치되어 있어야 합니다

## 🔧 배포 단계

### 1. GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. "New repository" 클릭
3. 저장소 이름: `ocr_extraction` (또는 원하는 이름)
4. "Public" 선택 (GitHub Pages 무료 사용을 위해)
5. "Create repository" 클릭

### 2. 로컬 저장소와 GitHub 연결

```bash
# GitHub 저장소 URL을 사용하여 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/ocr_extraction.git

# 브랜치 이름을 main으로 설정
git branch -M main

# 코드를 GitHub에 푸시
git push -u origin main
```

### 3. GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. "Settings" 탭 클릭
3. 왼쪽 메뉴에서 "Pages" 클릭
4. "Source"에서 "GitHub Actions" 선택
5. 자동으로 워크플로우가 실행됩니다

### 4. 배포 확인

- 배포가 완료되면 `https://YOUR_USERNAME.github.io/ocr_extraction/`에서 접근 가능
- Actions 탭에서 배포 진행상황 확인 가능

## 🔄 업데이트 배포

코드를 수정한 후:

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "Update: 새로운 기능 추가"

# GitHub에 푸시
git push origin main
```

자동으로 GitHub Actions가 실행되어 사이트가 업데이트됩니다.

## 📁 프로젝트 구조

```
ocr_extraction/
├── web-version/          # 웹 버전 (GitHub Pages용)
│   ├── index.html
│   ├── styles.css
│   ├── web-app.js
│   └── README.md
├── .github/workflows/    # GitHub Actions
│   └── deploy.yml
├── api/                  # 백엔드 API (선택사항)
│   └── process.js
├── package.json          # Node.js 설정
├── main.js              # Electron 메인
├── index.html           # Electron UI
├── styles.css           # 공통 스타일
└── README.md            # 프로젝트 문서
```

## 🎯 웹 버전 기능

- **파일 업로드**: 드래그 앤 드롭 지원
- **실시간 처리**: 업로드된 파일의 OCR 처리
- **결과 다운로드**: 추출된 텍스트를 파일로 다운로드
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🔧 커스터마이징

### 도메인 변경
- `web-version/index.html`에서 제목, 설명 수정
- `web-version/web-app.js`에서 기능 추가/수정

### 스타일 변경
- `web-version/styles.css`에서 디자인 수정

### 기능 추가
- `web-version/web-app.js`에서 JavaScript 로직 수정

## 🆘 문제 해결

### 배포가 안 되는 경우
1. GitHub Actions 탭에서 오류 확인
2. 저장소가 Public인지 확인
3. GitHub Pages 설정 확인

### 파일이 업로드되지 않는 경우
1. 파일 크기 제한 확인 (GitHub Pages는 100MB 제한)
2. 지원되는 파일 형식 확인

### 스타일이 적용되지 않는 경우
1. CSS 파일 경로 확인
2. 브라우저 캐시 삭제

## 📞 지원

문제가 발생하면 GitHub Issues를 통해 문의해주세요!
