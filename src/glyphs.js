/* ======================= SCHREIBSCHRIFT-VORLAGEN =======================
   Druckschrift (Grundschul-Stil) als Striche in Schreibreihenfolge.
   Format: Zeichen: [Breite, Strich1, Strich2, …] – jeder Strich ist ein SVG-Pfad.
   Lineatur: Oberlinie y=10, Mittellinie y=40, Grundlinie y=70, Unterlinie y=92. Punkte (i, j, ä …) sind sehr kurze Striche. */
const GLY = {
  A: [60, "M30 10 L5 70", "M30 10 L55 70", "M14 48 L46 48"],
  B: [52, "M8 10 L8 70", "M8 10 L28 10 C46 10 46 40 28 40 L8 40", "M8 40 L30 40 C51 40 51 70 30 70 L8 70"],
  C: [54, "M50 20 C42 8 22 6 12 18 C2 30 2 52 12 62 C22 74 42 72 50 60"],
  D: [54, "M8 10 L8 70", "M8 10 L24 10 C52 10 52 70 24 70 L8 70"],
  E: [44, "M8 10 L8 70", "M8 10 L40 10", "M8 40 L34 40", "M8 70 L40 70"],
  F: [42, "M8 10 L8 70", "M8 10 L38 10", "M8 40 L32 40"],
  G: [56, "M50 20 C42 8 22 6 12 18 C2 30 2 52 12 62 C22 74 44 72 50 58 L50 44 L32 44"],
  H: [52, "M8 10 L8 70", "M44 10 L44 70", "M8 40 L44 40"],
  I: [16, "M8 10 L8 70"],
  J: [40, "M32 10 L32 54 C32 74 8 74 6 58"],
  K: [48, "M8 10 L8 70", "M42 10 L8 44", "M19 33 L44 70"],
  L: [40, "M8 10 L8 70 L38 70"],
  M: [64, "M8 70 L8 10 L32 50 L56 10 L56 70"],
  N: [52, "M8 70 L8 10 L44 70 L44 10"],
  O: [60, "M30 10 C12 10 4 26 4 40 C4 54 12 70 30 70 C48 70 56 54 56 40 C56 26 48 10 30 10"],
  P: [48, "M8 10 L8 70", "M8 10 L28 10 C47 10 47 42 28 42 L8 42"],
  Q: [60, "M30 10 C12 10 4 26 4 40 C4 54 12 70 30 70 C48 70 56 54 56 40 C56 26 48 10 30 10", "M38 56 L56 76"],
  R: [50, "M8 10 L8 70", "M8 10 L28 10 C47 10 47 42 28 42 L8 42", "M26 42 L46 70"],
  S: [48, "M44 18 C40 9 26 8 18 10 C8 13 6 22 8 28 C11 36 24 38 32 42 C42 46 46 54 44 60 C41 70 26 72 18 70 C10 68 6 64 4 60"],
  T: [48, "M2 10 L46 10", "M24 10 L24 70"],
  U: [50, "M6 10 L6 50 C6 75 44 75 44 50 L44 10"],
  V: [52, "M2 10 L26 70 L50 10"],
  W: [72, "M2 10 L18 70 L36 22 L54 70 L70 10"],
  X: [48, "M4 10 L44 70", "M44 10 L4 70"],
  Y: [50, "M4 10 L25 40", "M46 10 L25 40 L25 70"],
  Z: [46, "M4 10 L42 10 L4 70 L44 70"],
  "Ä": [60, "M30 10 L5 70", "M30 10 L55 70", "M14 48 L46 48", "M21 -1 L21 0", "M39 -1 L39 0"],
  "Ö": [60, "M30 10 C12 10 4 26 4 40 C4 54 12 70 30 70 C48 70 56 54 56 40 C56 26 48 10 30 10", "M21 -1 L21 0", "M39 -1 L39 0"],
  "Ü": [50, "M6 10 L6 50 C6 75 44 75 44 50 L44 10", "M16 -1 L16 0", "M34 -1 L34 0"],

  a: [36, "M30 48 C28 42 23 40 18 40 C10 40 5 47 5 55 C5 64 11 70 18 70 C25 70 30 64 30 55", "M30 40 L30 70"],
  b: [36, "M6 10 L6 70", "M6 55 C6 46 12 40 19 40 C27 40 32 47 32 55 C32 64 26 70 19 70 C12 70 6 64 6 55"],
  c: [32, "M28 46 C25 41 20 40 16 40 C8 40 4 48 4 55 C4 63 9 70 16 70 C21 70 26 68 28 64"],
  d: [36, "M30 48 C28 42 23 40 18 40 C10 40 5 47 5 55 C5 64 11 70 18 70 C25 70 30 64 30 55", "M30 10 L30 70"],
  e: [34, "M5 55 L30 55 C30 46 24 40 17 40 C9 40 4 47 4 55 C4 64 10 70 17 70 C23 70 27 67 29 63"],
  f: [28, "M25 14 C21 8 10 8 10 20 L10 70", "M2 40 L24 40"],
  g: [36, "M30 48 C28 42 23 40 18 40 C10 40 5 47 5 55 C5 64 11 70 18 70 C25 70 30 64 30 55", "M30 40 L30 82 C30 95 10 95 6 86"],
  h: [34, "M6 10 L6 70", "M6 52 C8 43 13 40 19 40 C26 40 30 45 30 52 L30 70"],
  i: [14, "M7 40 L7 70", "M7 26 L7 27"],
  j: [22, "M14 40 L14 84 C14 95 4 95 2 88", "M14 26 L14 27"],
  k: [32, "M6 10 L6 70", "M28 40 L6 58", "M14 52 L30 70"],
  l: [14, "M7 10 L7 70"],
  m: [50, "M6 40 L6 70", "M6 50 C8 43 12 40 16 40 C22 40 26 44 26 50 L26 70", "M26 50 C28 43 32 40 36 40 C42 40 46 44 46 50 L46 70"],
  n: [34, "M6 40 L6 70", "M6 52 C8 43 13 40 19 40 C26 40 30 45 30 52 L30 70"],
  o: [34, "M17 40 C9 40 4 47 4 55 C4 64 9 70 17 70 C25 70 30 64 30 55 C30 47 25 40 17 40"],
  p: [36, "M6 40 L6 92", "M6 55 C6 46 12 40 19 40 C27 40 32 47 32 55 C32 64 26 70 19 70 C12 70 6 64 6 55"],
  q: [36, "M30 48 C28 42 23 40 18 40 C10 40 5 47 5 55 C5 64 11 70 18 70 C25 70 30 64 30 55", "M30 40 L30 92"],
  r: [26, "M6 40 L6 70", "M6 54 C8 44 14 40 24 41"],
  s: [28, "M25 44 C22 40 10 38 7 44 C4 50 10 53 16 55 C24 57 27 61 24 66 C21 71 9 71 4 66"],
  t: [24, "M10 18 L10 64 C10 70 16 71 22 68", "M2 40 L22 40"],
  u: [34, "M6 40 L6 58 C6 66 11 70 17 70 C24 70 28 64 28 58", "M28 40 L28 70"],
  v: [32, "M2 40 L16 70 L30 40"],
  w: [48, "M2 40 L12 70 L24 46 L36 70 L46 40"],
  x: [30, "M4 40 L26 70", "M26 40 L4 70"],
  y: [32, "M3 40 L16 70", "M29 40 L16 70 L8 92"],
  z: [30, "M4 40 L26 40 L4 70 L27 70"],
  "ä": [36, "M30 48 C28 42 23 40 18 40 C10 40 5 47 5 55 C5 64 11 70 18 70 C25 70 30 64 30 55", "M30 40 L30 70", "M11 28 L11 29", "M25 28 L25 29"],
  "ö": [34, "M17 40 C9 40 4 47 4 55 C4 64 9 70 17 70 C25 70 30 64 30 55 C30 47 25 40 17 40", "M10 28 L10 29", "M24 28 L24 29"],
  "ü": [34, "M6 40 L6 58 C6 66 11 70 17 70 C24 70 28 64 28 58", "M28 40 L28 70", "M10 28 L10 29", "M24 28 L24 29"],
  "ß": [36, "M6 70 L6 24 C6 12 14 8 20 8 C28 8 32 14 32 20 C32 28 24 34 16 36 C28 36 34 44 34 54 C34 64 26 72 16 68"],

  0: [40, "M20 10 C8 10 4 26 4 40 C4 54 8 70 20 70 C32 70 36 54 36 40 C36 26 32 10 20 10"],
  1: [30, "M6 24 L22 10 L22 70"],
  2: [40, "M6 22 C8 12 16 9 21 9 C30 9 35 16 35 24 C35 36 22 48 5 70 L37 70"],
  3: [40, "M6 16 C10 10 16 9 20 9 C29 9 34 15 34 23 C34 32 27 38 18 38 C29 38 36 45 36 54 C36 64 28 71 19 71 C12 71 7 67 5 63"],
  4: [42, "M28 10 L4 52 L40 52", "M30 32 L30 70"],
  5: [40, "M10 10 L8 36 C14 32 20 31 24 32 C32 34 36 42 36 50 C36 62 28 70 19 70 C12 70 7 67 4 62", "M10 10 L34 10"],
  6: [40, "M32 12 C28 9 24 9 21 9 C10 9 5 26 5 44 C5 60 10 71 20 71 C29 71 35 64 35 55 C35 45 29 39 20 39 C12 39 6 45 5 52"],
  7: [40, "M4 10 L36 10 L14 70"],
  8: [40, "M20 38 C29 38 33 32 33 24 C33 15 27 9 20 9 C13 9 7 15 7 24 C7 32 11 38 20 38 C30 38 36 45 36 54 C36 64 29 71 20 71 C11 71 4 64 4 54 C4 45 10 38 20 38"],
  9: [40, "M34 26 C34 16 28 9 20 9 C12 9 6 16 6 25 C6 34 12 40 20 40 C28 40 34 34 34 26 L34 44 C34 60 28 71 18 71 C12 71 8 68 6 64"]
};
const GL_UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", GL_LOW = "abcdefghijklmnopqrstuvwxyz", GL_DIG = "0123456789";

/* Pfade in Punktlisten umrechnen (einmal je Zeichen) */
const GLP = {};
let _gsvg = null, _gpath = null;
function glyph(ch) {
  if (GLP[ch]) return GLP[ch];
  const g = GLY[ch];
  if (!g) return null;
  if (!_gsvg) {
    const NS = "http://www.w3.org/2000/svg";
    _gsvg = document.createElementNS(NS, "svg");
    _gsvg.setAttribute("style", "position:absolute;left:-9px;top:-9px;width:1px;height:1px;overflow:hidden;visibility:hidden");
    _gpath = document.createElementNS(NS, "path");
    _gsvg.appendChild(_gpath);
    document.body.appendChild(_gsvg);
  }
  const strokes = g.slice(1).map(d => {
    _gpath.setAttribute("d", d);
    const L = _gpath.getTotalLength();
    const n = Math.max(1, Math.ceil(L / 1.5)), pts = [];
    for (let i = 0; i <= n; i++) { const p = _gpath.getPointAtLength((L * i) / n); pts.push([p.x, p.y]); }
    return { pts, len: L, dot: L < 3 };
  });
  return (GLP[ch] = { w: g[0], strokes });
}
const hasGlyphs = text => [...text].every(ch => ch === " " || GLY[ch]);
function layoutText(text) {
  let x = 0;
  const items = [];
  for (const ch of text) {
    if (ch === " ") { x += 24; continue; }
    const g = glyph(ch);
    if (!g) continue;
    items.push({ ch, g, x });
    x += g.w + 8;
  }
  return { items, w: Math.max(40, x - 8) };
}
function polyline(x, pts, dx, lw) {
  if (!pts.length) return;
  const [a0, b0] = pts[0];
  const span = pts.reduce((m, p) => Math.max(m, Math.abs(p[0] - a0) + Math.abs(p[1] - b0)), 0);
  if (pts.length === 1 || span < 1.2) { x.beginPath(); x.arc(a0 + dx, b0, lw / 2, 0, Math.PI * 2); x.fill(); return; }
  x.beginPath();
  x.moveTo(a0 + dx, b0);
  for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0] + dx, pts[i][1]);
  x.stroke();
}

/* ---------- Nachspuren prüfen: Wie viel der Vorlage ist bedeckt, wie viel Tinte liegt auf der Vorlage? ---------- */
function traceScore(lay, kid) {
  const W = Math.ceil((lay.w + 40) * 2), H = 220;
  const mk = draw => {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.setTransform(2, 0, 0, 2, 40, 20);
    x.lineCap = x.lineJoin = "round";
    x.strokeStyle = x.fillStyle = "#000";
    draw(x);
    return x.getImageData(0, 0, W, H).data;
  };
  const guide = lw => x => { x.lineWidth = lw; for (const it of lay.items) for (const s of it.g.strokes) polyline(x, s.pts, it.x, s.dot ? lw + 4 : lw); };
  const kidD = lw => x => { x.lineWidth = lw; for (const s of kid) polyline(x, s, 0, lw); };
  const K = mk(guide(3)), G = mk(guide(26)), Cw = mk(kidD(18)), Ct = mk(kidD(3));
  let k = 0, kc = 0, c = 0, cg = 0;
  for (let i = 3; i < K.length; i += 4) {
    if (K[i] > 100) { k++; if (Cw[i] > 100) kc++; }
    if (Ct[i] > 100) { c++; if (G[i] > 100) cg++; }
  }
  return { cov: k ? kc / k : 0, prec: c ? cg / c : 0, ink: c };
}

/* ---------- Frei geschrieben: Welches Zeichen ist es? (Form-Vergleich mit Abstandskarten) ---------- */
const RN = 40;
function rasterNorm(strokes) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const s of strokes) for (const [x, y] of s) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const bw = x1 - x0, bh = y1 - y0, m = Math.max(bw, bh, 1), sc = (RN - 10) / m;
  const ox = (RN - bw * sc) / 2 - x0 * sc, oy = (RN - bh * sc) / 2 - y0 * sc;
  const c = document.createElement("canvas");
  c.width = c.height = RN;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.lineCap = x.lineJoin = "round"; x.lineWidth = 2.6; x.strokeStyle = x.fillStyle = "#000";
  for (const s of strokes) polyline(x, s.map(([a, b]) => [a * sc + ox, b * sc + oy]), 0, 2.6);
  const d = x.getImageData(0, 0, RN, RN).data, m2 = new Uint8Array(RN * RN);
  for (let i = 0; i < RN * RN; i++) m2[i] = d[i * 4 + 3] > 90 ? 1 : 0;
  return m2;
}
function distMap(mask) {
  const N = RN, D = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) D[i] = mask[i] ? 0 : 1e6;
  const r2 = Math.SQRT2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x;
    if (x > 0) D[i] = Math.min(D[i], D[i - 1] + 1);
    if (y > 0) { D[i] = Math.min(D[i], D[i - N] + 1); if (x > 0) D[i] = Math.min(D[i], D[i - N - 1] + r2); if (x < N - 1) D[i] = Math.min(D[i], D[i - N + 1] + r2); }
  }
  for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
    const i = y * N + x;
    if (x < N - 1) D[i] = Math.min(D[i], D[i + 1] + 1);
    if (y < N - 1) { D[i] = Math.min(D[i], D[i + N] + 1); if (x < N - 1) D[i] = Math.min(D[i], D[i + N + 1] + r2); if (x > 0) D[i] = Math.min(D[i], D[i + N - 1] + r2); }
  }
  return D;
}
/* weitere Schreibweisen, wie Kinder sie oft schreiben (1 als Strich, 7 mit Querstrich, 4 geschlossen) */
const ALT = {
  1: [[[22, 10], [22, 70]]], I: [[[8, 10], [8, 70]]],
  7: [[[4, 10], [36, 10], [14, 70]], [[12, 42], [30, 42]]],
  4: [[[28, 10], [4, 52], [40, 52]], [[30, 10], [30, 70]]]
};
const TPL = {};
function tpl(ch) {
  if (TPL[ch]) return TPL[ch];
  const list = [glyph(ch).strokes.map(s => s.pts)];
  if (ALT[ch]) list.push(ALT[ch]);
  return (TPL[ch] = list.map(st => { const m = rasterNorm(st); return { m, d: distMap(m) }; }));
}
function shapeDist(A, dA, B, dB) {
  let s1 = 0, n1 = 0, s2 = 0, n2 = 0;
  for (let i = 0; i < A.length; i++) { if (A[i]) { s1 += dB[i]; n1++; } if (B[i]) { s2 += dA[i]; n2++; } }
  return (n1 ? s1 / n1 : 99) + (n2 ? s2 / n2 : 99);
}
function recognize(strokes, set) {
  const A = rasterNorm(strokes), dA = distMap(A);
  return [...set].map(ch => ({ ch, d: Math.min(...tpl(ch).map(T => shapeDist(A, dA, T.m, T.d))) })).sort((a, b) => a.d - b.d);
}
