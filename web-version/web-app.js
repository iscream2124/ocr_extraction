class MinerUWebApp {
    constructor() {
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        console.log('MinerU Web App 초기화 중...');
        this.setupEventListeners();
        this.updateFileList();
        console.log('MinerU Web App 초기화 완료');
    }

    setupEventListeners() {
        console.log('이벤트 리스너 설정 중...');
        
        // 파일 업로드 영역
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const folderInput = document.getElementById('folderInput');
        
        console.log('Upload area:', uploadArea);
        console.log('File input:', fileInput);
        console.log('Folder input:', folderInput);
        
        if (uploadArea && fileInput) {
            // 클릭 이벤트
            uploadArea.addEventListener('click', (e) => {
                console.log('Upload area clicked!');
                e.preventDefault();
                fileInput.click();
            });
            
            // 키보드 이벤트 (Enter, Space)
            uploadArea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log('Upload area key pressed:', e.key);
                    e.preventDefault();
                    fileInput.click();
                }
            });
            
            // 드래그 오버 이벤트
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.add('drag-over');
                console.log('Drag over');
            });
            
            // 드래그 리브 이벤트
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('drag-over');
                console.log('Drag leave');
            });
            
            // 드롭 이벤트
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('drag-over');
                console.log('Files dropped:', e.dataTransfer.files);
                this.handleFiles(Array.from(e.dataTransfer.files));
            });
            
            // 파일 입력 변경 이벤트
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed:', e.target.files);
                this.handleFiles(Array.from(e.target.files));
            });
            
            console.log('파일 업로드 이벤트 리스너 설정 완료');
        } else {
            console.error('업로드 영역 또는 파일 입력 요소를 찾을 수 없습니다!');
        }
        
        // 폴더 입력 이벤트
        if (folderInput) {
            folderInput.addEventListener('change', (e) => {
                console.log('Folder input changed:', e.target.files);
                this.handleFiles(Array.from(e.target.files));
            });
            console.log('폴더 입력 이벤트 리스너 설정 완료');
        }

        // 버튼 이벤트
        const processBtn = document.getElementById('processBtn');
        const clearBtn = document.getElementById('clearBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        const selectFileBtn = document.getElementById('selectFileBtn');
        
        if (processBtn) {
            processBtn.addEventListener('click', () => this.processFiles());
            console.log('처리 버튼 이벤트 설정');
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFiles());
            console.log('초기화 버튼 이벤트 설정');
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResult());
            console.log('다운로드 버튼 이벤트 설정');
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyResult());
            console.log('복사 버튼 이벤트 설정');
        }
        
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', () => {
                console.log('파일 선택 버튼 클릭됨');
                fileInput.click();
            });
            console.log('파일 선택 버튼 이벤트 설정');
        }
        
        console.log('모든 이벤트 리스너 설정 완료');
    }

    handleFiles(files) {
        console.log('파일 처리 시작:', files);
        
        if (!files || files.length === 0) {
            console.log('처리할 파일이 없습니다');
            return;
        }

        let addedCount = 0;
        const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        
        files.forEach(file => {
            console.log('파일 처리 중:', file.name, '타입:', file.type);
            
            if (this.isValidFile(file)) {
                // 중복 체크
                const isDuplicate = this.uploadedFiles.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );
                
                if (!isDuplicate) {
                    this.uploadedFiles.push(file);
                    addedCount++;
                    console.log('파일 추가됨:', file.name);
                } else {
                    console.log('중복 파일 건너뜀:', file.name);
                    this.showMessage(`중복 파일: ${file.name}`, 'warning');
                }
            } else {
                console.log('지원되지 않는 파일 형식:', file.name, file.type);
                this.showMessage(`지원되지 않는 파일 형식: ${file.name}`, 'error');
            }
        });
        
        if (addedCount > 0) {
            this.updateFileList();
            this.showMessage(`${addedCount}개 파일이 추가되었습니다.`, 'success');
        }
    }

    isValidFile(file) {
        const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        return supportedTypes.includes(file.type);
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) {
            console.error('파일 목록 요소를 찾을 수 없습니다!');
            return;
        }
        
        console.log('파일 목록 업데이트 중...', this.uploadedFiles.length, '개 파일');
        
        fileList.innerHTML = '';

        if (this.uploadedFiles.length === 0) {
            fileList.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">업로드된 파일이 없습니다.</p>';
            return;
        }

        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // 파일 타입별 아이콘
            let fileIcon = 'fas fa-file';
            if (file.type === 'application/pdf') {
                fileIcon = 'fas fa-file-pdf';
            } else if (file.type.startsWith('image/')) {
                fileIcon = 'fas fa-file-image';
            }
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="${fileIcon}"></i>
                    <span>${file.name}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button class="btn btn-small btn-danger" onclick="app.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
        
        console.log('파일 목록 업데이트 완료');
    }

    removeFile(index) {
        console.log('파일 제거:', index);
        if (index >= 0 && index < this.uploadedFiles.length) {
            const removedFile = this.uploadedFiles.splice(index, 1)[0];
            this.updateFileList();
            this.showMessage(`파일 제거됨: ${removedFile.name}`, 'info');
        }
    }

    clearFiles() {
        console.log('모든 파일 초기화');
        this.uploadedFiles = [];
        this.updateFileList();
        document.getElementById('resultSection').style.display = 'none';
        this.showMessage('모든 파일이 초기화되었습니다.', 'info');
    }

    processFiles() {
        console.log('파일 처리 시작');
        
        if (this.uploadedFiles.length === 0) {
            this.showMessage('처리할 파일을 선택해주세요.', 'warning');
            return;
        }

        this.showMessage('파일 처리를 시작합니다...', 'info');
        
        // 실제 처리 로직은 여기에 구현
        // 현재는 시뮬레이션
        setTimeout(() => {
            this.showMessage('처리가 완료되었습니다! (시뮬레이션)', 'success');
            this.showResult('처리된 텍스트 결과가 여기에 표시됩니다.\n\n이것은 시뮬레이션 결과입니다.');
        }, 2000);
    }

    showResult(text) {
        const resultSection = document.getElementById('resultSection');
        const resultText = document.getElementById('resultText');
        
        if (resultSection && resultText) {
            resultText.value = text;
            resultSection.style.display = 'block';
        }
    }

    downloadResult() {
        const resultText = document.getElementById('resultText');
        if (!resultText || !resultText.value) {
            this.showMessage('다운로드할 결과가 없습니다.', 'warning');
            return;
        }

        const blob = new Blob([resultText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ocr_result.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('결과가 다운로드되었습니다.', 'success');
    }

    copyResult() {
        const resultText = document.getElementById('resultText');
        if (!resultText || !resultText.value) {
            this.showMessage('복사할 결과가 없습니다.', 'warning');
            return;
        }

        resultText.select();
        document.execCommand('copy');
        this.showMessage('결과가 클립보드에 복사되었습니다.', 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // 간단한 알림 표시 (실제 구현에서는 더 나은 UI 사용)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#000';
                break;
            default:
                notification.style.backgroundColor = '#17a2b8';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// 전역 함수들 정의 (오류 방지용)
window.selectFile = function() {
    console.log('selectFile 함수 호출됨 (웹 버전)');
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    } else {
        console.error('fileInput 요소를 찾을 수 없습니다');
    }
};

window.selectFolder = function() {
    console.log('selectFolder 함수 호출됨 (웹 버전)');
    const folderInput = document.getElementById('folderInput');
    if (folderInput) {
        folderInput.click();
    } else {
        console.error('folderInput 요소를 찾을 수 없습니다');
    }
};

window.selectOutputDir = function() {
    console.log('selectOutputDir 함수 호출됨 (웹 버전)');
    // 웹 버전에서는 출력 폴더 선택을 지원하지 않음
    alert('웹 버전에서는 출력 폴더 선택을 지원하지 않습니다. 결과는 브라우저에서 다운로드됩니다.');
};

window.validateInputPath = function() {
    console.log('validateInputPath 함수 호출됨 (웹 버전)');
    // 웹 버전에서는 파일 경로 검증이 다르게 처리됨
    return Promise.resolve();
};

// DOM이 로드된 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료, 앱 초기화 시작');
    window.app = new MinerUWebApp();
    console.log('앱 초기화 완료, window.app:', window.app);
});