const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '/tmp/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = async (req, res) => {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 파일 업로드 처리
    const uploadMiddleware = upload.array('files');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      const files = req.files;
      const { method, language, formula, table } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // 출력 디렉토리 생성
      const outputDir = '/tmp/output';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // MinerU 실행
      const results = [];
      
      for (const file of files) {
        try {
          const result = await runMinerU(file.path, outputDir, {
            method: method || 'auto',
            language: language || 'korean',
            formula: formula === 'true',
            table: table === 'true'
          });
          
          results.push({
            filename: file.originalname,
            text: result.text,
            success: true
          });
        } catch (error) {
          results.push({
            filename: file.originalname,
            error: error.message,
            success: false
          });
        }
      }

      // 임시 파일 정리
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      res.json({
        success: true,
        results: results,
        combinedText: results
          .filter(r => r.success)
          .map(r => `=== ${r.filename} ===\n${r.text}`)
          .join('\n\n')
      });
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function runMinerU(inputPath, outputDir, options) {
  return new Promise((resolve, reject) => {
    const args = [
      '-p', inputPath,
      '-o', outputDir,
      '-m', options.method,
      '-l', options.language,
      '-f', options.formula.toString(),
      '-t', options.table.toString(),
      '-d', 'cpu'
    ];

    const mineruProcess = spawn('mineru', args, {
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    mineruProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    mineruProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    mineruProcess.on('close', (code) => {
      if (code === 0) {
        // 결과 파일 읽기
        const resultFiles = fs.readdirSync(outputDir);
        const textFiles = resultFiles.filter(f => f.endsWith('.txt'));
        
        let combinedText = '';
        textFiles.forEach(file => {
          const content = fs.readFileSync(path.join(outputDir, file), 'utf8');
          combinedText += content + '\n\n';
        });

        // 출력 디렉토리 정리
        resultFiles.forEach(file => {
          fs.unlinkSync(path.join(outputDir, file));
        });

        resolve({ text: combinedText.trim() });
      } else {
        reject(new Error(`MinerU failed with code ${code}: ${errorOutput}`));
      }
    });

    mineruProcess.on('error', (error) => {
      reject(new Error(`Failed to start MinerU: ${error.message}`));
    });
  });
}
