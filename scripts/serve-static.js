// Zero-dependency static file server for the `out/` export, used only by the
// Playwright smoke tests — avoids adding a `serve`-style package for this.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'out');
const PORT = process.env.PORT || 4173;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain',
};

http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(ROOT, reqPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    // Next's file-convention OG images (opengraph-image, twitter-image) ship
    // extensionless — sniff the PNG magic bytes rather than trusting the name.
    const isPng = data.length > 8 && data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
    const contentType = MIME[path.extname(filePath)] || (isPng ? 'image/png' : 'application/octet-stream');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}`));
