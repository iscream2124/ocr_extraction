// DOM 요소들
const inputPathEl = document.getElementById('inputPath');
const outputPathEl = document.getElementById('outputPath');
const fileInfoEl = document.getElementById('fileInfo');
const fileStatusEl = document.getElementById('fileStatus');
const selectFileBtn = document.getElementById('selectFileBtn');
const selectFolderBtn = document.getElementById('selectFolderBtn');
const selectOutputBtn = document.getElementById('selectOutputBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const openOutputBtn = document.getElementById('openOutputBtn');
const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
const logContentEl = document.getElementById('logContent');
const progressSectionEl = document.getElementById('progressSection');
const progressFillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');
const loadingOverlayEl = document.getElementById('loadingOverlay');

// 옵션 요소들
const methodEl = document.getElementById('method');
const backendEl = document.getElementById('backend');
const languageEl = document.getElementById('language');
const deviceEl = document.getElementById('device');
const formulaEl = document.getElementById('formula');
const tableEl = document.getElementById('table');

// 상태 변수
let isProcessing = false;
let currentOutputPath = '';
let electronWarningShown = false;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateFileStatus('info', '지원 형식: PDF, PNG, JPG, JPEG');
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 파일 선택 버튼들
    selectFileBtn.addEventListener('click', selectFile);
    selectFolderBtn.addEventListener('click', selectFolder);
    selectOutputBtn.addEventListener('click', selectOutputDir);

    // 제어 버튼들
    startBtn.addEventListener('click', startProcessing);
    stopBtn.addEventListener('click', stopProcessing);
    clearBtn.addEventListener('click', clearLog);
    openOutputBtn.addEventListener('click', openOutputFolder);
    scrollToBottomBtn.addEventListener('click', scrollToBottom);

    // 입력 경로 변경 감지
    inputPathEl.addEventListener('input', validateInputPath);

    if (!hasElectronAPI()) {
        handleMissingElectronEnvironment('이벤트 리스너 초기화');
        return;
    }

    const onMinerUOutput = ensureElectronMethod('onMinerUOutput');
    if (onMinerUOutput) {
        onMinerUOutput((event, data) => {
            addLogEntry('info', data.trim());
        });
    }

    const onMinerUError = ensureElectronMethod('onMinerUError');
    if (onMinerUError) {
        onMinerUError((event, data) => {
            addLogEntry('error', data.trim());
        });
    }
}

// 파일 선택
async function selectFile() {
    const selectFileFn = ensureElectronMethod('selectFile');
    if (!selectFileFn) {
        return;
    }

    try {
        const filePath = await selectFileFn();
        if (filePath) {
            inputPathEl.value = filePath;
            await validateInputPath();
        }
    } catch (error) {
        addLogEntry('error', `파일 선택 오류: ${error.message}`);
    }
}

// 폴더 선택
async function selectFolder() {
    const selectFolderFn = ensureElectronMethod('selectFolder');
    if (!selectFolderFn) {
        return;
    }

    try {
        const folderPath = await selectFolderFn();
        if (folderPath) {
            inputPathEl.value = folderPath;
            await validateInputPath();
        }
    } catch (error) {
        addLogEntry('error', `폴더 선택 오류: ${error.message}`);
    }
}

// 출력 디렉토리 선택
async function selectOutputDir() {
    const selectOutputDirFn = ensureElectronMethod('selectOutputDir');
    if (!selectOutputDirFn) {
        return;
    }

    try {
        const outputPath = await selectOutputDirFn();
        if (outputPath) {
            outputPathEl.value = outputPath;
            currentOutputPath = outputPath;
            openOutputBtn.disabled = false;
        }
    } catch (error) {
        addLogEntry('error', `출력 디렉토리 선택 오류: ${error.message}`);
    }
}

// 입력 경로 검증
async function validateInputPath() {
    const inputPath = inputPathEl.value.trim();
    if (!inputPath) {
        updateFileStatus('info', '지원 형식: PDF, PNG, JPG, JPEG');
        return;
    }

    const checkFileExistsFn = ensureElectronMethod('checkFileExists');
    if (!checkFileExistsFn) {
        return;
    }

    try {
        const fileInfo = await checkFileExistsFn(inputPath);
        
        if (fileInfo.exists) {
            if (fileInfo.isFile) {
                const ext = inputPath.split('.').pop().toLowerCase();
                const supportedExts = ['pdf', 'png', 'jpg', 'jpeg'];
                
                if (supportedExts.includes(ext)) {
                    updateFileStatus('success', `✓ 파일 확인됨: ${inputPath.split('/').pop()}`);
                } else {
                    updateFileStatus('error', `⚠ 지원되지 않는 파일 형식: .${ext}`);
                }
            } else if (fileInfo.isDirectory) {
                updateFileStatus('success', `✓ 폴더 확인됨: ${inputPath.split('/').pop()}`);
            }
        } else {
            updateFileStatus('error', `⚠ 경로를 찾을 수 없습니다: ${inputPath}`);
        }
    } catch (error) {
        updateFileStatus('error', `⚠ 오류: ${error.message}`);
    }
}

// 파일 상태 업데이트
function updateFileStatus(type, message) {
    fileStatusEl.className = `file-status ${type}`;
    fileStatusEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
}

// OCR 처리 시작
async function startProcessing() {
    const inputPath = inputPathEl.value.trim();
    const outputPath = outputPathEl.value.trim();

    if (!inputPath) {
        addLogEntry('error', '입력 파일/폴더를 선택해주세요.');
        return;
    }

    if (!outputPath) {
        addLogEntry('error', '출력 디렉토리를 선택해주세요.');
        return;
    }

    const checkFileExistsFn = ensureElectronMethod('checkFileExists');
    if (!checkFileExistsFn) {
        return;
    }

    // 파일 존재 여부 확인
    const fileInfo = await checkFileExistsFn(inputPath);
    if (!fileInfo.exists) {
        addLogEntry('error', '입력 파일/폴더가 존재하지 않습니다.');
        return;
    }

    const runMinerUFn = ensureElectronMethod('runMinerU');
    if (!runMinerUFn) {
        return;
    }

    // UI 상태 변경
    isProcessing = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    progressSectionEl.style.display = 'block';
    loadingOverlayEl.style.display = 'flex';

    // 옵션 수집
    const options = {
        inputPath,
        outputPath,
        method: methodEl.value,
        backend: backendEl.value,
        language: languageEl.value,
        formula: formulaEl.checked,
        table: tableEl.checked,
        device: deviceEl.value
    };
    
    addLogEntry('info', `처리 시작: ${inputPath.split('/').pop()}`);
    addLogEntry('info', `출력 디렉토리: ${outputPath}`);
    addLogEntry('info', `옵션: ${JSON.stringify(options, null, 2)}`);
    
    try {
        const result = await runMinerUFn(options);
        
        if (result.success) {
            addLogEntry('success', '✓ OCR 처리가 성공적으로 완료되었습니다!');
            updateProgress(100, '처리 완료');
            currentOutputPath = outputPath;
            openOutputBtn.disabled = false;
        } else {
            addLogEntry('error', `처리 실패: ${result.error}`);
        }
    } catch (error) {
        addLogEntry('error', `처리 오류: ${error.message}`);
    } finally {
        // UI 상태 복원
        isProcessing = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        loadingOverlayEl.style.display = 'none';
    }
}

// OCR 처리 중지
async function stopProcessing() {
    const stopMinerUFn = ensureElectronMethod('stopMinerU');
    if (!stopMinerUFn) {
        return;
    }

    try {
        const stopped = await stopMinerUFn();
        if (stopped) {
            addLogEntry('warning', '처리가 중지되었습니다.');
        }
    } catch (error) {
        addLogEntry('error', `중지 오류: ${error.message}`);
    }
}

// 로그 지우기
function clearLog() {
    logContentEl.innerHTML = `
        <div class="log-entry info">
            <span class="log-time">[시작]</span>
            <span class="log-message">로그가 지워졌습니다.</span>
        </div>
    `;
}

// 출력 폴더 열기
async function openOutputFolder() {
    if (currentOutputPath) {
        const openOutputFolderFn = ensureElectronMethod('openOutputFolder');
        if (!openOutputFolderFn) {
            return;
        }

        try {
            await openOutputFolderFn(currentOutputPath);
        } catch (error) {
            addLogEntry('error', `폴더 열기 오류: ${error.message}`);
        }
    }
}

// 로그 맨 아래로 스크롤
function scrollToBottom() {
    logContentEl.scrollTop = logContentEl.scrollHeight;
}

// 로그 항목 추가
function addLogEntry(type, message) {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-message">${message}</span>
    `;
    
    logContentEl.appendChild(logEntry);
    logContentEl.scrollTop = logContentEl.scrollHeight;
}

function getElectronAPI() {
    return window.electronAPI ?? null;
}

function hasElectronAPI() {
    return Boolean(getElectronAPI());
}

function ensureElectronMethod(methodName) {
    const api = getElectronAPI();
    if (!api) {
        handleMissingElectronEnvironment(methodName);
        return null;
    }

    const method = api?.[methodName];
    if (typeof method !== 'function') {
        console.error(`[MinerU] electronAPI.${methodName} is not available.`);
        handleMissingElectronEnvironment(methodName);
        return null;
    }

    return method.bind(api);
}

function handleMissingElectronEnvironment(context = '') {
    if (!electronWarningShown) {
        const contextInfo = context ? ` (필요 기능: ${context})` : '';
        addLogEntry('error', `Electron API를 사용할 수 없습니다${contextInfo}. 앱을 Electron 환경에서 실행해주세요 (예: npm start).`);
        updateFileStatus('error', 'Electron 환경에서 실행된 경우에만 파일을 선택할 수 있습니다.');
        electronWarningShown = true;
    }
    disableElectronOnlyControls();
}

function disableElectronOnlyControls() {
    [selectFileBtn, selectFolderBtn, selectOutputBtn, startBtn, stopBtn, openOutputBtn].forEach((btn) => {
        if (btn) {
            btn.disabled = true;
        }
    });
}

// 진행상황 업데이트
function updateProgress(percentage, text) {
    progressFillEl.style.width = `${percentage}%`;
    progressTextEl.textContent = text;
}

// 키보드 단축키
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter: 처리 시작
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (!isProcessing) {
            startProcessing();
        }
    }
    
    // Escape: 처리 중지
    if (event.key === 'Escape' && isProcessing) {
        stopProcessing();
    }
    
    // Ctrl/Cmd + L: 로그 지우기
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        clearLog();
    }
});

// 창 닫기 전 확인
window.addEventListener('beforeunload', (event) => {
    if (isProcessing) {
        event.preventDefault();
        event.returnValue = '처리가 진행 중입니다. 정말 종료하시겠습니까?';
    }
});

// 자동 스크롤 (새 로그가 추가될 때)
const observer = new MutationObserver(() => {
    logContentEl.scrollTop = logContentEl.scrollHeight;
});

observer.observe(logContentEl, {
    childList: true,
    subtree: true
});
