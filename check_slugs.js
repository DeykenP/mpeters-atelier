const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');
const regex = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`${match[1]} | ${match[2]}`);
}
