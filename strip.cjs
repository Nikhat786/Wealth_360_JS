const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:\\Nikhat\\Roarathon\\Wealth_360\\Wealth_360_JS\\src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const isTsx = filePath.endsWith('.tsx');
    const outPath = filePath.replace(/\.tsx?$/, isTsx ? '.jsx' : '.js');
    
    try {
        const res = babel.transformFileSync(filePath, {
          plugins: [
            ['@babel/plugin-transform-typescript', { isTSX: true }],
            '@babel/plugin-syntax-jsx'
          ],
          retainLines: true
        });
        
        if (res && res.code) {
          fs.writeFileSync(outPath, res.code);
          fs.unlinkSync(filePath);
          console.log('Processed', outPath);
        }
    } catch (e) {
        console.error('Failed to process', filePath, e);
    }
  }
});
