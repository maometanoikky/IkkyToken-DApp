const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/ACER/.gemini/antigravity/brain/677154a7-9940-42b9-97d4-d92b27beee5f/walkthrough.md';

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Replace any /C:/Users/... or file:///C:/Users/... paths with C:\Users\ACER\... Windows-style paths
content = content.replace(/\(\/?C:\/Users\/ACER\/\.gemini\/antigravity\/brain\/677154a7-9940-42b9-97d4-d92b27beee5f\/([a-zA-Z0-9_-]+)\.png\)/g, (match, filename) => {
  return `(C:\\Users\\ACER\\.gemini\\antigravity\\brain\\677154a7-9940-42b9-97d4-d92b27beee5f\\${filename}.png)`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Standardized image paths to Windows absolute format in walkthrough.md!');
