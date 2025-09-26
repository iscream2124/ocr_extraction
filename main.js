const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // 메인 윈도우 생성
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // HTML 파일 로드
  mainWindow.loadFile('index.html');

  // 윈도우가 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 개발 모드에서 DevTools 열기
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS에서 독 아이콘 클릭 시 윈도우 다시 열기
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 파일 선택 대화상자
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: '지원 파일', extensions: ['pdf', 'png', 'jpg', 'jpeg'] },
      { name: 'PDF 파일', extensions: ['pdf'] },
      { name: '이미지 파일', extensions: ['png', 'jpg', 'jpeg'] },
      { name: '모든 파일', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 폴더 선택 대화상자
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 출력 디렉토리 선택 대화상자
ipcMain.handle('select-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 파일 존재 여부 확인
ipcMain.handle('check-file-exists', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      modified: stats.mtime
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
});

// MinerU 실행
ipcMain.handle('run-mineru', async (event, options) => {
  return new Promise((resolve, reject) => {
    const {
      inputPath,
      outputPath,
      method = 'auto',
      backend = 'pipeline',
      language = 'korean',
      formula = true,
      table = true,
      device = 'cpu'
    } = options;

    // MinerU 명령어 구성
    const args = [
      '-p', inputPath,
      '-o', outputPath,
      '-m', method,
      '-b', backend,
      '-l', language,
      '-f', formula.toString(),
      '-t', table.toString(),
      '-d', device
    ];

    console.log('MinerU 실행:', 'mineru', args.join(' '));

    // 플랫폼별 환경 설정
    const env = { ...process.env };
    
    // macOS에서 pyenv 환경 설정
    if (process.platform === 'darwin') {
      env.PATH = `/Users/im_1511/.pyenv/shims:${env.PATH}`;
    }
    
    // Windows에서 Python 경로 설정
    if (process.platform === 'win32') {
      // Windows에서 Python이 PATH에 있는지 확인
      const pythonPath = process.env.PYTHON_PATH || 'python';
      console.log('Python 경로:', pythonPath);
    }

    const mineruProcess = spawn('mineru', args, {
      env: env,
      cwd: process.cwd()
    });

    let output = '';
    let errorOutput = '';

    mineruProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // 실시간으로 렌더러 프로세스에 전송
      mainWindow.webContents.send('mineru-output', text);
    });

    mineruProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      // 실시간으로 렌더러 프로세스에 전송
      mainWindow.webContents.send('mineru-error', text);
    });

    mineruProcess.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          output: output,
          error: errorOutput
        });
      } else {
        reject({
          success: false,
          code: code,
          output: output,
          error: errorOutput
        });
      }
    });

    mineruProcess.on('error', (error) => {
      reject({
        success: false,
        error: error.message
      });
    });

    // 프로세스 ID를 저장하여 나중에 종료할 수 있도록 함
    event.sender.mineruProcess = mineruProcess;
  });
});

// MinerU 프로세스 중지
ipcMain.handle('stop-mineru', async (event) => {
  if (event.sender.mineruProcess) {
    event.sender.mineruProcess.kill();
    event.sender.mineruProcess = null;
    return true;
  }
  return false;
});

// 출력 폴더 열기
ipcMain.handle('open-output-folder', async (event, folderPath) => {
  try {
    await shell.openPath(folderPath);
    return true;
  } catch (error) {
    console.error('폴더 열기 오류:', error);
    return false;
  }
});
