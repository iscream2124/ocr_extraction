const { contextBridge, ipcRenderer } = require('electron');

// 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 파일 선택
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),
  
  // 파일 시스템
  checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
  
  // MinerU 실행
  runMinerU: (options) => ipcRenderer.invoke('run-mineru', options),
  stopMinerU: () => ipcRenderer.invoke('stop-mineru'),
  
  // 출력 폴더 열기
  openOutputFolder: (folderPath) => ipcRenderer.invoke('open-output-folder', folderPath),
  
  // 이벤트 리스너
  onMinerUOutput: (callback) => ipcRenderer.on('mineru-output', callback),
  onMinerUError: (callback) => ipcRenderer.on('mineru-error', callback),
  
  // 이벤트 리스너 제거
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
