// 웹 버전 MinerU OCR 앱
class MinerUWebApp {
    constructor() {
        this.uploadedFiles = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 파일 업로드
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                console.log('Upload area clicked');
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('drag-over');
                const files = Array.from(e.dataTransfer.files);
                console.log('Files dropped:', files);
                this.addFiles(files);
            });
            
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed:', e.target.files);
                const files = Array.from(e.target.files);
                this.addFiles(files);
            });
        }

        // 버튼 이벤트
        const processBtn = document.getElementById('processBtn');
        const clearBtn = document.getElementById('clearBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        
        if (processBtn) processBtn.addEventListener('click', this.processFiles.bind(this));
        if (clearBtn) clearBtn.addEventListener('click', this.clearFiles.bind(this));
        if (downloadBtn) downloadBtn.addEventListener('click', this.downloadResult.bind(this));
        if (copyBtn) copyBtn.addEventListener('click', this.copyResult.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }

    isValidFile(file) {
        const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        return supportedTypes.includes(file.type);
    }

    addFiles(files) {
        console.log('Adding files:', files);
        let addedCount = 0;
        
        files.forEach(file => {
            console.log('Processing file:', file.name, 'Type:', file.type);
            
            if (this.isValidFile(file)) {
                // 중복 파일 체크
                const isDuplicate = this.uploadedFiles.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );
                
                if (!isDuplicate) {
                    this.uploadedFiles.push(file);
                    addedCount++;
                    console.log('File added:', file.name);
                } else {
                    console.log('Duplicate file skipped:', file.name);
                    this.showMessage(`중복 파일: ${file.name}`, 'warning');
                }
            } else {
                console.log('Invalid file type:', file.name, file.type);
                this.showMessage(`지원되지 않는 파일 형식: ${file.name}`, 'error');
            }
        });
        
        if (addedCount > 0) {
            this.updateFileList();
            this.showMessage(`${addedCount}개 파일이 추가되었습니다.`, 'success');
        }
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) {
            console.error('File list element not found');
            return;
        }
        
        fileList.innerHTML = '';

        if (this.uploadedFiles.length === 0) {
            fileList.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">업로드된 파일이 없습니다.</p>';
            return;
        }

        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // 파일 타입에 따른 아이콘 설정
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
        
        console.log('File list updated with', this.uploadedFiles.length, 'files');
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateFileList();
    }

    clearFiles() {
        this.uploadedFiles = [];
        this.updateFileList();
        document.getElementById('resultSection').style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async processFiles() {
        if (this.uploadedFiles.length === 0) {
            this.showMessage('파일을 먼저 업로드해주세요.', 'warning');
            return;
        }

        // UI 상태 변경
        document.getElementById('processBtn').disabled = true;
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('loadingOverlay').style.display = 'flex';

        try {
            // FormData 생성
            const formData = new FormData();
            this.uploadedFiles.forEach(file => {
                formData.append('files', file);
            });

            // 옵션 추가
            formData.append('method', document.getElementById('method').value);
            formData.append('language', document.getElementById('language').value);
            formData.append('formula', document.getElementById('formula').checked);
            formData.append('table', document.getElementById('table').checked);

            // 서버로 전송 (실제 구현에서는 백엔드 API 필요)
            const result = await this.sendToServer(formData);
            
            if (result.success) {
                this.showResult(result.text);
                this.showMessage('OCR 처리가 완료되었습니다!', 'success');
            } else {
                this.showMessage(`처리 실패: ${result.error}`, 'error');
            }
        } catch (error) {
            this.showMessage(`오류 발생: ${error.message}`, 'error');
        } finally {
            // UI 상태 복원
            document.getElementById('processBtn').disabled = false;
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    }

    async sendToServer(formData) {
        // 실제 구현에서는 백엔드 API 엔드포인트로 전송
        // 여기서는 시뮬레이션
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    text: `추출된 텍스트:\n\n${this.uploadedFiles.map(f => f.name).join(', ')} 파일에서 텍스트를 추출했습니다.\n\n이것은 데모 결과입니다. 실제 구현에서는 MinerU 백엔드가 필요합니다.`
                });
            }, 3000);
        });
    }

    showResult(text) {
        document.getElementById('resultText').textContent = text;
        document.getElementById('resultSection').style.display = 'block';
        this.extractedText = text;
    }

    downloadResult() {
        if (!this.extractedText) return;

        const blob = new Blob([this.extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_text.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    copyResult() {
        if (!this.extractedText) return;

        navigator.clipboard.writeText(this.extractedText).then(() => {
            this.showMessage('텍스트가 클립보드에 복사되었습니다.', 'success');
        }).catch(() => {
            this.showMessage('복사에 실패했습니다.', 'error');
        });
    }

    showMessage(message, type = 'info') {
        // 간단한 알림 구현
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// 앱 초기화
const app = new MinerUWebApp();
