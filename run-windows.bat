@echo off
echo MinerU GUI - OCR 텍스트 추출 도구
echo ====================================
echo.

REM Node.js 설치 확인
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 오류: Node.js가 설치되지 않았습니다.
    echo https://nodejs.org 에서 Node.js를 다운로드하여 설치하세요.
    pause
    exit /b 1
)

REM Python 설치 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 경고: Python이 설치되지 않았거나 PATH에 없습니다.
    echo MinerU를 사용하려면 Python이 필요합니다.
    echo.
)

REM 의존성 설치 확인
if not exist "node_modules" (
    echo 의존성을 설치하는 중...
    npm install
    if %errorlevel% neq 0 (
        echo 오류: 의존성 설치에 실패했습니다.
        pause
        exit /b 1
    )
)

REM Electron 앱 실행
echo MinerU GUI를 시작하는 중...
echo.
npm start

pause
