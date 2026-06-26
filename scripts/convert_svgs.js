const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const diagramsDir = path.join(__dirname, '..', 'docs', 'diagrams');

if (!fs.existsSync(diagramsDir)) {
  console.error(`Directory not found: ${diagramsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(diagramsDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${files.length} SVG files to convert...`);

async function convertAll() {
  for (const file of files) {
    const svgPath = path.join(diagramsDir, file);
    const pngPath = path.join(diagramsDir, file.replace('.svg', '.png'));
    
    try {
      await sharp(svgPath)
        .png()
        .toFile(pngPath);
      console.log(`✅ Converted: ${file} -> ${path.basename(pngPath)}`);
    } catch (err) {
      console.error(`❌ Error converting ${file}:`, err);
    }
  }
}

convertAll().then(() => {
  console.log('Conversion complete!');
});
