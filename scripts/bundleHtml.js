const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const assetsDir = path.join(__dirname, '..', 'assets', 'images');

// Helper to convert image to base64 Data URI
function getBase64Image(filePath) {
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1);
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  return `data:${mime};base64,${fileData.toString('base64')}`;
}

// 1. Read CSS & JS files
const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const foodJs = fs.readFileSync(path.join(rootDir, 'js', 'food.js'), 'utf8');
const snakeJs = fs.readFileSync(path.join(rootDir, 'js', 'snake.js'), 'utf8');
let gameJs = fs.readFileSync(path.join(rootDir, 'js', 'game.js'), 'utf8');

// 2. Read image base64 strings
const map2Base64 = getBase64Image(path.join(assetsDir, 'Map2.png'));
const transparentFaceBase64 = getBase64Image(path.join(assetsDir, 'transparent-face.png'));
const greenFaceBase64 = getBase64Image(path.join(assetsDir, 'green-face.png'));

const bodyBase64s = [];
for (let i = 0; i < 13; i++) {
  bodyBase64s.push(getBase64Image(path.join(assetsDir, 'body', `${i}.png`)));
}

// 3. Create image map script
const imagePreloadScript = `
  window.IMAGE_DATA = {
    map2: "${map2Base64}",
    transparentFace: "${transparentFaceBase64}",
    greenFace: "${greenFaceBase64}",
    body: ${JSON.stringify(bodyBase64s)}
  };

  // Intercept Image.src to map local paths to base64 Data URIs
  const OriginalImage = window.Image;
  window.Image = function() {
    const img = new OriginalImage();
    let originalSrcSetter = Object.getOwnPropertyDescriptor(OriginalImage.prototype, 'src').set;
    Object.defineProperty(img, 'src', {
      set: function(val) {
        if (val.includes('Map2.png')) {
          originalSrcSetter.call(this, window.IMAGE_DATA.map2);
        } else if (val.includes('transparent-face.png')) {
          originalSrcSetter.call(this, window.IMAGE_DATA.transparentFace);
        } else if (val.includes('green-face.png')) {
          originalSrcSetter.call(this, window.IMAGE_DATA.greenFace);
        } else if (val.includes('images/body/')) {
          const match = val.match(/images\\/body\\/(\\d+)\\.png/);
          if (match && match[1]) {
            const idx = parseInt(match[1], 10) % window.IMAGE_DATA.body.length;
            originalSrcSetter.call(this, window.IMAGE_DATA.body[idx]);
          } else {
            originalSrcSetter.call(this, val);
          }
        } else {
          originalSrcSetter.call(this, val);
        }
      },
      get: function() {
        return this.getAttribute('src');
      }
    });
    return img;
  };
`;

// 4. Assemble complete self-contained HTML
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Snake Zone | Youhh</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      ${cssContent}
    </style>
</head>
<body>
    <script>
      ${imagePreloadScript}
    </script>
    <script>
      ${foodJs}
    </script>
    <script>
      ${snakeJs}
    </script>
    <script>
      ${gameJs}
    </script>
</body>
</html>`;

// 5. Write to src/gameHtml.js
const outputFile = path.join(__dirname, '..', 'src', 'gameHtml.js');
fs.writeFileSync(outputFile, `export const GAME_HTML = ${JSON.stringify(htmlContent)};\n`);
console.log('Successfully bundled gameHtml.js!');
