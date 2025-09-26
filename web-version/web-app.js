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
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // 버튼 이벤트
        document.getElementById('processBtn').addEventListener('click', this.processFiles.bind(this));
        document.getElementById('clearBtn').addEventListener('click', this.clearFiles.bind(this));
        document.getElementById('downloadBtn').addEventListener('click', this.downloadResult.bind(this));
        document.getElementById('copyBtn').addEventListener('click', this.copyResult.bind(this));
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

    addFiles(files) {
        const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        
        files.forEach(file => {
            if (supportedTypes.includes(file.type)) {
                this.uploadedFiles.push(file);
                this.updateFileList();
            } else {
                this.showMessage(`지원되지 않는 파일 형식: ${file.name}`, 'error');
            }
        });
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button class="btn btn-small btn-danger" onclick="app.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
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
