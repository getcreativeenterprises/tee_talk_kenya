// Draws a QR code as a clean vector SVG: pure black squares, error correction level H,
// 4-module quiet zone, no logo. Uses the local library in js/vendor/qrcode.js (no third party).
function buildQr(text) {
  const qr = qrcode(0, "H");
  qr.addData(text, "Byte");
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 4;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
  const size = n + quiet * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${d}" fill="#000000"/></svg>`;
  return { svg, modules: n, size, isDark: (r, c) => qr.isDark(r, c) };
}
if (typeof module !== "undefined") module.exports = { buildQr };
