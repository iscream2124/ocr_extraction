# MinerU GUI - OCR 텍스트 추출 도구
# PowerShell 실행 스크립트

Write-Host "MinerU GUI - OCR 텍스트 추출 도구" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Node.js 설치 확인
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 버전: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 오류: Node.js가 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "https://nodejs.org 에서 Node.js를 다운로드하여 설치하세요." -ForegroundColor Yellow
    Read-Host "아무 키나 누르세요..."
    exit 1
}

# Python 설치 확인
try {
    $pythonVersion = python --version
    Write-Host "✓ Python 버전: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ 경고: Python이 설치되지 않았거나 PATH에 없습니다." -ForegroundColor Yellow
    Write-Host "MinerU를 사용하려면 Python이 필요합니다." -ForegroundColor Yellow
    Write-Host ""
}

# 의존성 설치 확인
if (-not (Test-Path "node_modules")) {
    Write-Host "의존성을 설치하는 중..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 오류: 의존성 설치에 실패했습니다." -ForegroundColor Red
        Read-Host "아무 키나 누르세요..."
        exit 1
    }
}

# Electron 앱 실행
Write-Host "MinerU GUI를 시작하는 중..." -ForegroundColor Green
Write-Host ""
npm start

Read-Host "아무 키나 누르세요..."
