const fs = require('fs');
const path = require('path');

const diagramsDir = path.join(__dirname, '..', 'docs', 'diagrams');
const files = fs.readdirSync(diagramsDir).filter(file => file.startsWith('sd_') && file.endsWith('.svg'));

console.log(`Found ${files.length} sequence diagram SVG files to update.`);

const scaleFactor = 1.35;

function scaleY(yStr) {
  const y = parseFloat(yStr);
  if (y > 90) {
    return Math.round(100 + (y - 100) * scaleFactor);
  }
  return y;
}

for (const file of files) {
  const filePath = path.join(diagramsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update Box Colors to Black & White / Monochrome
  // Box 1: User / Owner
  content = content.replace(/fill="#f0f9ff"\s+stroke="#0284c7"/g, 'fill="#ffffff" stroke="#000000"');
  content = content.replace(/fill="#0369a1"/g, 'fill="#000000"');
  
  // Box 2: Frontend DApp
  content = content.replace(/fill="#f0fdfa"\s+stroke="#0d9488"/g, 'fill="#ffffff" stroke="#000000"');
  content = content.replace(/fill="#0f766e"/g, 'fill="#000000"');

  // Box 3: MetaMask Wallet
  content = content.replace(/fill="#fff7ed"\s+stroke="#ea580c"/g, 'fill="#ffffff" stroke="#000000"');
  content = content.replace(/fill="#c2410c"/g, 'fill="#000000"');

  // Box 4: Smart Contract
  content = content.replace(/fill="#f5f3ff"\s+stroke="#6366f1"/g, 'fill="#ffffff" stroke="#000000"');
  content = content.replace(/fill="#4f46e5"/g, 'fill="#000000"');

  // 2. Respace Vertical Layout (Scale Y coordinates > 90)
  
  // Scale SVG Height and ViewBox height
  content = content.replace(/<svg\s+([^>]*width="[0-9.]+"\s+)height="([0-9.]+)"\s+viewBox="0\s+0\s+([0-9.]+)\s+([0-9.]+)"/g, (match, prefix, height, vbW, vbH) => {
    const newHeight = scaleY(height);
    const newVbH = scaleY(vbH);
    return `<svg ${prefix}height="${newHeight}" viewBox="0 0 ${vbW} ${newVbH}"`;
  });

  // Scale Lifeline dashed vertical lines (which start at y1=90 and end at y2 > 90)
  content = content.replace(/<line\s+([^>]*y1="90"\s+[^>]*y2="([0-9.]+)")/g, (match, fullAttr, y2) => {
    const newY2 = scaleY(y2);
    return match.replace(`y2="${y2}"`, `y2="${newY2}"`);
  });

  // Scale normal line coordinates (y1 and y2)
  content = content.replace(/<line\s+([^>]*)y1="([0-9.]+)"([^>]*)y2="([0-9.]+)"/g, (match, beforeY1, y1, middle, y2) => {
    const newY1 = scaleY(y1);
    const newY2 = scaleY(y2);
    let updated = match;
    updated = updated.replace(`y1="${y1}"`, `y1="${newY1}"`);
    updated = updated.replace(`y2="${y2}"`, `y2="${newY2}"`);
    return updated;
  });

  // Scale rect positions (activation bars, where y >= 100)
  content = content.replace(/<rect\s+([^>]*)y="([0-9.]+)"([^>]*)height="([0-9.]+)"/g, (match, beforeY, y, middle, height) => {
    const yVal = parseFloat(y);
    if (yVal >= 100) {
      const newY = scaleY(y);
      const newHeight = Math.round(parseFloat(height) * scaleFactor);
      let updated = match;
      updated = updated.replace(`y="${y}"`, `y="${newY}"`);
      updated = updated.replace(`height="${height}"`, `height="${newHeight}"`);
      return updated;
    }
    return match;
  });

  // Scale path coordinates (self-calls)
  content = content.replace(/<path\s+d="M\s*([0-9.]+),([0-9.]+)\s+C\s*([0-9.]+),([0-9.]+)\s+([0-9.]+),([0-9.]+)\s+([0-9.]+),([0-9.]+)"/g, (match, x1, y1, xc1, yc1, xc2, yc2, x2, y2) => {
    const newY1 = scaleY(y1);
    const newYc1 = scaleY(yc1);
    const newYc2 = scaleY(yc2);
    const newY2 = scaleY(y2);
    return `<path d="M ${x1},${newY1} C ${xc1},${newYc1} ${xc2},${newYc2} ${x2},${newY2}"`;
  });

  // Scale text y coordinates
  content = content.replace(/<text\s+([^>]*)y="([0-9.]+)"/g, (match, beforeY, y) => {
    const yVal = parseFloat(y);
    if (yVal > 95) {
      const newY = scaleY(y);
      return match.replace(`y="${y}"`, `y="${newY}"`);
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated: ${file}`);
}

console.log('Sequence diagrams styling and spacing update complete!');
