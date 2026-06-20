const fs = require('fs');

const productsFile = 'src/data/products.ts';
let content = fs.readFileSync(productsFile, 'utf8');

const regex = /name:\s*"([^"]+)",[\s\S]*?images:\s*\["([^"]+)"\]/g;
let match;
let report = [];

while ((match = regex.exec(content)) !== null) {
  const name = match[1];
  const imagePath = match[2];
  
  // Check if file exists locally
  const localPath = "public" + imagePath;
  const exists = fs.existsSync(localPath);
  
  report.push({
    name,
    expectedPath: imagePath,
    exists
  });
}

console.log(JSON.stringify(report, null, 2));
