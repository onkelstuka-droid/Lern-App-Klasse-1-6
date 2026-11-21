/* ======================= MALEN =======================
   Blatt mit festem Seitenverhältnis (PDOC.aspect = Höhe/Breite, passend zum Handy), Koordinaten 0…1.
   Ebenen: base (Striche + Füllungen) → Ausmalbild-Linien → Stempel → Auswahl-Rahmen. */
const PAINT_COLORS = ["#23324a", "#9aa5b1", "#f2554f", "#ff9532", "#ffbf1f", "#fff176", "#5ec94d", "#1fbf9f", "#3a9cff", "#9a78ff", "#ff64ab", "#f5c9a0", "#8b5a2b", "#ffffff"];
const STAMPS = ["⭐", "❤️", "🌸", "🐞", "☀️", "🌈", "🦋", "🐟"];
let PNT = { mode: "pen", c: "#3a9cff", w: 10, stamp: null }; // mode: pen | fill | erase | stamp
let PDOC = null;        // die Zeichnung: { shapes, tpl, aspect }
let PAINT = null;       // die Malfläche auf dem Bildschirm
let PAINT_FULL = false; // ganzer Bildschirm
const picKey = () => "lernapp_bilder_" + G.cur;
function loadPics() { try { return JSON.parse(localStorage.getItem(picKey()) || "[]"); } catch (e) { return []; } }
const paperAspect = () => Math.max(1.25, Math.min(2.1, (innerHeight - 70) / Math.max(1, innerWidth)));
function newDrawing(tpl) { PDOC = { shapes: [], tpl: tpl || null, aspect: paperAspect() }; }

function renderPaint() {
  if (!PDOC) newDrawing();
  const colors = PAINT_COLORS.map(c => `<button class="sw" data-color="${c}" style="background:${c}" aria-label="Farbe"></button>`).join("");
  const sizes = [[5, 8], [10, 14], [22, 22], [36, 30]].map(([w, px]) => `<button class="tool" data-width="${w}" aria-label="Größe"><i style="width:${px}px;height:${px}px"></i></button>`).join("");
  const modes = `<button class="tool wide" data-mode="pen">🖌️ Pinsel</button><button class="tool wide" data-mode="fill">🪣 Füllen</button><button class="tool wide" data-mode="erase">🧽 Schwamm</button>`;
  const stamps = STAMPS.map(s => `<button class="tool" data-stamp="${s}">${s}</button>`).join("");
  if (PAINT_FULL) {
    app().innerHTML = `<div class="pf">
      <div class="pf-bar">
        <div class="pf-row"><button class="tool wide" data-act="paint-small">✖ Klein</button>${modes.replace(/ Pinsel| Füllen| Schwamm/g, "")}${sizes}<button class="tool" data-act="paint-undo" aria-label="Rückgängig">↩️</button><button class="tool" data-act="paint-save" aria-label="Speichern">💾</button></div>
        <div class="pf-row">${colors}${stamps}</div>
        <div class="muted pf-hint" id="paintHint"></div>
      </div>
      <canvas class="paint full" id="paintCv"></canvas></div>`;
    initPaint(); paintSync();
    return;
  }
  const pics = loadPics();
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">🎨 Malen</div></div>
    <div class="paint-main">
      <button class="btn green" data-act="paint-save">💾 Speichern</button>
      <button class="btn wa" data-act="paint-share">💬 Schicken</button>
      <button class="btn ghost" data-act="paint-clear">🗑️ Neu</button>
    </div>
    <div class="paint-main two">
      <button class="btn orange" data-act="paint-tpl">🖍️ Ausmalbilder</button>
      <button class="btn" data-act="paint-full">⛶ Ganzer Bildschirm</button>
    </div>
    <div class="paint-tools">${colors}</div>
    <div class="paint-tools">${modes}</div>
    <div class="paint-tools"><span class="sizes">${sizes}</span></div>
    <div class="paint-tools">${stamps}</div>
    <div class="muted" id="paintHint" style="margin:-2px 0 6px"></div>
    <canvas class="paint" id="paintCv"></canvas>
    <div class="padbar"><button class="btn ghost small" data-act="paint-undo">↩️ Letzten Schritt weg</button></div>
    ${pics.length ? `<div class="sec"><h3>Meine Bilder</h3></div><div class="muted" style="margin-bottom:8px">📥 = aufs Handy speichern · 💬 = verschicken (z. B. WhatsApp) · ✖ = löschen</div><div class="gallery">${pics.map((src, i) => `<figure><img src="${src}" alt="Bild ${i + 1}"><button data-delpic="${i}" aria-label="Löschen">✖</button><button class="exp" data-exppic="${i}" aria-label="Aufs Handy speichern">📥</button><button class="shr" data-shrpic="${i}" aria-label="Teilen">💬</button></figure>`).join("")}</div>` : ""}
  </div>`;
  initPaint(); paintSync();
}
/* Knöpfe richtig markieren + Hinweis */
function paintSync() {
  const m = PNT.mode;
  document.querySelectorAll("[data-color]").forEach(b => b.setAttribute("aria-pressed", (m === "pen" || m === "fill") && b.dataset.color === PNT.c));
  document.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === m));
  document.querySelectorAll("[data-width]").forEach(b => b.setAttribute("aria-pressed", (m === "pen" || m === "erase") && Number(b.dataset.width) === PNT.w));
  document.querySelectorAll("[data-stamp]").forEach(b => b.setAttribute("aria-pressed", m === "stamp" && b.dataset.stamp === PNT.stamp));
  const h = $("#paintHint");
  if (h) h.innerHTML = m === "erase" ? "🧽 Schwamm: Wische über das, was weg soll." : m === "fill" ? "🪣 Füllen: Farbe wählen und in eine Fläche tippen." : m === "stamp" ? `<div class="row" style="flex-wrap:wrap"><span class="sp">Tippe ins Bild, um ${PNT.stamp} zu stempeln. Stempel antippen = verschieben, mit zwei Fingern größer ziehen.</span><button class="tool" data-act="stamp-smaller" aria-label="kleiner">➖</button><button class="tool" data-act="stamp-bigger" aria-label="größer">➕</button></div>` : "🖌️ Pinsel: Farbe und Größe wählen und losmalen.";
  if (PAINT && PAINT.draw) PAINT.draw();
}

function initPaint() {
  const cv = $("#paintCv"), ctx = cv.getContext("2d"), doc = PDOC;
  const base = document.createElement("canvas"), bctx = base.getContext("2d", { willReadFrequently: true });
  const line = document.createElement("canvas"), lctx = line.getContext("2d", { willReadFrequently: true });
  let dpr = 1, W = 0, H = 0, ox = 0, oy = 0, pw = 1, ph = 1, bw = 1, bh = 1, lineMask = null;
  const V = PAINT = { cv, sel: null, cur: null };
  const stampPx = s => pw * 0.11 * (s.s || 1);
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left - ox) / pw, (e.clientY - r.top - oy) / ph]; };

  function size() {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2.5);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    pw = Math.max(10, Math.min(W - 6, (H - 6) / doc.aspect)); ph = pw * doc.aspect;
    ox = (W - pw) / 2; oy = (H - ph) / 2;
    bw = Math.max(1, Math.round(pw * dpr)); bh = Math.max(1, Math.round(ph * dpr));
    base.width = line.width = bw; base.height = line.height = bh;
    buildLines(); rebuild(); draw();
  }
  /* Ausmalbild als Linien-Ebene (verdeckte Linien entfernt) + Maske für den Füll-Eimer */
  function buildLines() {
    lineMask = new Uint8Array(bw * bh);
    lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, bw, bh);
    const t = doc.tpl && TPL_BY[doc.tpl];
    if (!t) return;
    lctx.fillStyle = "#fff"; lctx.fillRect(0, 0, bw, bh);
    const s = Math.min(bw / 300, bh / 400) * 0.96;
    lctx.setTransform(s, 0, 0, s, (bw - 300 * s) / 2, (bh - 400 * s) / 2);
    lctx.lineJoin = lctx.lineCap = "round"; lctx.strokeStyle = "#23324a"; lctx.lineWidth = 5;
    for (const f of t.s) { const p = new Path2D(shapeD(f)); if (tplClosed(f)) { lctx.fillStyle = "#fff"; lctx.fill(p); } lctx.stroke(p); }
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    const img = lctx.getImageData(0, 0, bw, bh), d = img.data;
    for (let i = 0, k = 0; i < d.length; i += 4, k++) {
      const a = 255 - Math.round((d[i] + d[i + 1] + d[i + 2]) / 3); // dunkel = Linie
      d[i] = 35; d[i + 1] = 50; d[i + 2] = 74; d[i + 3] = a;
      if (a > 70) lineMask[k] = 1;
    }
    lctx.putImageData(img, 0, 0);
  }
  /* Füll-Eimer: zusammenhängende, ähnlich gefärbte Fläche, begrenzt durch die Ausmalbild-Linien */
  function floodFill(data, p, hex) {
    let x = Math.floor(p[0] * bw), y = Math.floor(p[1] * bh);
    if (x < 0 || y < 0 || x >= bw || y >= bh) return;
    if (lineMask[y * bw + x]) { // auf eine Linie getippt: nächstes freies Pixel suchen
      let found = false;
      for (let r = 1; r <= 8 && !found; r++) for (let dy = -r; dy <= r && !found; dy++) for (let dx = -r; dx <= r && !found; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < bw && yy < bh && !lineMask[yy * bw + xx]) { x = xx; y = yy; found = true; } }
      if (!found) return;
    }
    const cr = parseInt(hex.slice(1, 3), 16), cg = parseInt(hex.slice(3, 5), 16), cb = parseInt(hex.slice(5, 7), 16);
    const i0 = (y * bw + x) * 4, tr = data[i0], tg = data[i0 + 1], tb = data[i0 + 2];
    if (Math.abs(tr - cr) + Math.abs(tg - cg) + Math.abs(tb - cb) < 8) return;
    const seen = new Uint8Array(bw * bh), stack = new Int32Array(bw * bh);
    let sp = 0; stack[sp++] = y * bw + x; seen[y * bw + x] = 1;
    while (sp) {
      const k = stack[--sp], i = k * 4;
      data[i] = cr; data[i + 1] = cg; data[i + 2] = cb; data[i + 3] = 255;
      const kx = k % bw;
      const nb = [kx > 0 ? k - 1 : -1, kx < bw - 1 ? k + 1 : -1, k >= bw ? k - bw : -1, k + bw < bw * bh ? k + bw : -1];
      for (const n of nb) {
        if (n < 0 || seen[n]) continue;
        seen[n] = 1;
        if (lineMask[n]) { const j = n * 4; data[j] = cr; data[j + 1] = cg; data[j + 2] = cb; data[j + 3] = 255; continue; } // Linienrand mitfärben (kein weißer Saum)
        const j = n * 4;
        if (Math.abs(data[j] - tr) + Math.abs(data[j + 1] - tg) + Math.abs(data[j + 2] - tb) > 90) continue;
        stack[sp++] = n;
      }
    }
  }
  function strokeOn(c, s, sc) { // Strich auf eine Fläche malen (sc = Pixel pro CSS-Pixel)
    c.strokeStyle = c.fillStyle = s.c; c.lineWidth = s.w * sc; c.lineCap = c.lineJoin = "round";
    polyline(c, s.pts.map(([x, y]) => [x * pw * sc, y * ph * sc]), 0, s.w * sc);
  }
  function rebuild() { // base neu aufbauen: Striche und Füllungen der Reihe nach
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.fillStyle = "#fff"; bctx.fillRect(0, 0, bw, bh);
    let img = null;
    for (const s of doc.shapes) {
      if (s.stamp) continue;
      if (s.fill) { if (!img) img = bctx.getImageData(0, 0, bw, bh); floodFill(img.data, s.p, s.fill); continue; }
      if (img) { bctx.putImageData(img, 0, 0); img = null; }
      strokeOn(bctx, s, dpr);
    }
    if (img) bctx.putImageData(img, 0, 0);
  }
  function drawStamps(c, sc, offx, offy) {
    c.textAlign = "center"; c.textBaseline = "middle";
    for (const s of doc.shapes) if (s.stamp) { c.font = `${Math.round(stampPx(s) * sc)}px sans-serif`; c.fillText(s.stamp, offx + s.p[0] * pw * sc, offy + s.p[1] * ph * sc); }
  }
  function draw(clean) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#dfe8f2"; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(base, ox, oy, pw, ph);
    if (V.cur) { ctx.save(); ctx.translate(ox, oy); strokeOn(ctx, V.cur, 1); ctx.restore(); }
    ctx.drawImage(line, ox, oy, pw, ph);
    drawStamps(ctx, 1, ox, oy);
    const sel = doc.shapes[V.sel];
    if (!clean && sel && sel.stamp && PNT.mode === "stamp") {
      const r = stampPx(sel) * 0.62;
      ctx.save(); ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.strokeStyle = "#3a9cff";
      ctx.strokeRect(ox + sel.p[0] * pw - r, oy + sel.p[1] * ph - r, 2 * r, 2 * r); ctx.restore();
    }
  }
  /* fertiges Bild (ohne Auswahl), höchstens 1280 Pixel breit */
  V.snapshot = (type = "image/png", q) => {
    const c = document.createElement("canvas"), x = c.getContext("2d");
    c.width = bw; c.height = bh;
    x.drawImage(base, 0, 0); x.drawImage(line, 0, 0); drawStamps(x, dpr, 0, 0);
    if (bw <= 1280) return c.toDataURL(type, q);
    const w = 1280, h = Math.round((bh / bw) * w), c2 = document.createElement("canvas");
    c2.width = w; c2.height = h; c2.getContext("2d").drawImage(c, 0, 0, w, h);
    return c2.toDataURL(type, q);
  };
  V.draw = draw; V.resize = size;
  V.undo = () => { const s = doc.shapes.pop(); if (s && !s.stamp) rebuild(); V.sel = null; draw(); };
  V.scaleSel = f => { const s = doc.shapes[V.sel]; if (!s || !s.stamp) return toast("Tippe zuerst auf einen Stempel im Bild."); s.s = Math.max(0.3, Math.min(5, (s.s || 1) * f)); draw(); };

  const ptrs = new Map();
  let pinch = null, drag = null;
  const hitStamp = p => { for (let k = doc.shapes.length - 1; k >= 0; k--) { const s = doc.shapes[k]; if (!s.stamp) continue; if (Math.hypot((p[0] - s.p[0]) * pw, (p[1] - s.p[1]) * ph) <= stampPx(s) * 0.6) return k; } return -1; };
  const inPaper = p => p[0] >= 0 && p[1] >= 0 && p[0] <= 1 && p[1] <= 1;
  cv.addEventListener("pointerdown", e => {
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    ptrs.set(e.pointerId, pos(e));
    const p = pos(e);
    if (PNT.mode === "stamp") {
      if (ptrs.size === 2 && V.sel != null) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot((a[0] - b[0]) * pw, (a[1] - b[1]) * ph) || 1, s: doc.shapes[V.sel].s || 1 }; drag = null; return; }
      if (ptrs.size > 1) return;
      const k = hitStamp(p);
      if (k >= 0) { V.sel = k; drag = { dx: doc.shapes[k].p[0] - p[0], dy: doc.shapes[k].p[1] - p[1] }; draw(); return; }
      if (!inPaper(p)) return;
      doc.shapes.push({ stamp: PNT.stamp, p, s: 1 }); V.sel = doc.shapes.length - 1; drag = null;
      tone([880], "sine", 0, 0.1, 0.05); draw(); return;
    }
    if (ptrs.size > 1) { if (V.cur) { doc.shapes.pop(); V.cur = null; draw(); } return; } // zweiter Finger: Strich abbrechen
    if (PNT.mode === "fill") {
      if (!inPaper(p)) return;
      doc.shapes.push({ fill: PNT.c, p });
      const img = bctx.getImageData(0, 0, bw, bh); floodFill(img.data, p, PNT.c); bctx.putImageData(img, 0, 0);
      tone([660], "sine", 0, 0.12, 0.05); draw(); return;
    }
    V.cur = PNT.mode === "erase" ? { c: "#ffffff", w: Math.round(PNT.w * 2.5), pts: [p] } : { c: PNT.c, w: PNT.w, pts: [p] };
    doc.shapes.push(V.cur); draw();
  });
  cv.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, pos(e));
    if (PNT.mode === "stamp") {
      const sel = doc.shapes[V.sel];
      if (pinch && sel && ptrs.size >= 2) { const [a, b] = [...ptrs.values()]; sel.s = Math.max(0.3, Math.min(5, pinch.s * Math.hypot((a[0] - b[0]) * pw, (a[1] - b[1]) * ph) / pinch.d)); draw(); }
      else if (drag && sel) { const p = pos(e); sel.p = [p[0] + drag.dx, p[1] + drag.dy]; draw(); }
      return;
    }
    if (!V.cur) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) V.cur.pts.push(pos(ev));
    draw();
  });
  const up = e => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!ptrs.size) drag = null;
    if (V.cur) { strokeOn(bctx, V.cur, dpr); V.cur = null; draw(); }
  };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  size();
}

/* ---------- Ausmalbild auswählen ---------- */
function pickTemplate() {
  const d = document.createElement("div");
  d.className = "modal";
  d.innerHTML = `<div class="modal-box tpl-box"><div class="row"><b style="font-size:22px" class="sp">🖍️ Ausmalbilder</b><button class="icon-btn" data-tpl-close aria-label="Schließen">✖</button></div>
    <div class="tpl-grid"><button data-tpl=""><span class="blank">📄</span><small>Leeres Blatt</small></button>${TPLS.map(t => `<button data-tpl="${t.id}">${tplSvg(t)}<small>${t.n}</small></button>`).join("")}</div></div>`;
  d.addEventListener("click", e => {
    const b = e.target.closest("[data-tpl],[data-tpl-close]");
    if (!b && e.target !== d) return;
    e.stopPropagation(); d.remove();
    if (!b || b.hasAttribute("data-tpl-close")) return;
    const id = b.dataset.tpl;
    const start = () => { newDrawing(id); PNT.mode = id ? "fill" : "pen"; if (PNT.c === "#ffffff") PNT.c = "#3a9cff"; renderPaint(); if (id) toast("🪣 Farbe wählen und in die Flächen tippen!"); };
    if (PDOC && PDOC.shapes.length) ask("Neues Bild anfangen?<br><small>Das jetzige Bild ist dann weg – vorher 💾 speichern!</small>", "Ja, neues Bild", "Nein", "🖍️").then(ok => ok && start());
    else start();
  });
  document.body.appendChild(d);
}
function paintFull(on) {
  PAINT_FULL = on;
  try {
    if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  } catch (e) {}
  document.body.classList.toggle("noscroll", on);
  renderPaint();
}

/* ---------- Bild speichern / schicken ---------- */
/* Bild-Datei sofort (ohne Warten) erzeugen – sonst verbietet Android das Teilen (1.5.1) */
function picFile(src) {
  const [head, data] = src.split(","), type = (head.match(/data:(.*?);/) || [, "image/png"])[1];
  const bin = atob(data), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  const d = new Date(), name = `Lern-App-Bild-${dayStr(d)}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}.${type === "image/png" ? "png" : "jpg"}`;
  return new File([u], name, { type });
}
function downloadFile(file) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file); a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
/* share = true: Teilen-Menü (WhatsApp …); sonst Datei in „Downloads“ speichern */
function exportPic(src, share = false) {
  let file;
  try { file = picFile(src); } catch (e) { toast("Das Bild konnte nicht vorbereitet werden."); return Promise.resolve(false); }
  if (!share) { downloadFile(file); return Promise.resolve(true); }
  const data = { files: [file], title: "" }; // nur das Bild (mit Text: WhatsApp „Teilen fehlgeschlagen“, 1.6); leerer Titel (1.7)
  const canFiles = navigator.share && navigator.canShare && navigator.canShare({ files: [file] });
  if (!canFiles) {
    downloadFile(file);
    toast("Dieses Handy kann Bilder hier nicht direkt verschicken. Das Bild liegt in „Downloads“ – in WhatsApp über 📎 anhängen.");
    return Promise.resolve(false);
  }
  return navigator.share(data).then(() => { setTimeout(() => toast("Hat WhatsApp „Teilen fehlgeschlagen“ gemeldet? Dann 💾 Speichern und in WhatsApp über 📎 → Galerie anhängen."), 1500); return true; }).catch(e => {
    if (e && e.name === "AbortError") return false;
    return ask("Bild verschicken?", "💬 Jetzt schicken", "Abbrechen", "📨").then(ok => {
      if (!ok) return false;
      return navigator.share({ files: [file] }).then(() => true).catch(e2 => {
        if (e2 && e2.name === "AbortError") return false;
        downloadFile(file);
        toast(`Schicken klappt gerade nicht (${(e2 && e2.name) || "Fehler"}). Das Bild liegt in „Downloads“ – in WhatsApp über 📎 anhängen.`);
        return false;
      });
    });
  });
}
function savePaint() { // in „Meine Bilder“ und als Bild-Datei aufs Handy (Ordner „Downloads“)
  if (!PAINT || !PDOC.shapes.length) return toast("Male zuerst etwas! 🖍️");
  const snap = PAINT.snapshot("image/png"), img = new Image();
  img.onload = () => {
    const w = 480, h = Math.round((img.height / img.width) * w), c = document.createElement("canvas");
    c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h);
    const pics = loadPics(); pics.unshift(c.toDataURL("image/jpeg", 0.72));
    while (pics.length > 12) pics.pop();
    try { localStorage.setItem(picKey(), JSON.stringify(pics)); } catch (e) { pics.pop(); try { localStorage.setItem(picKey(), JSON.stringify(pics.slice(0, 6))); } catch (e2) {} }
    if (!PAINT_FULL) renderPaint();
  };
  img.src = snap;
  exportPic(snap).then(ok => { if (ok) toast("Gespeichert! 🖼️ Unter „Meine Bilder“ und auf dem Handy im Ordner „Downloads“."); });
  confetti(14); tone([523, 659, 784]);
}

/* Klicks im Malbereich (aus dem allgemeinen Klick-Verteiler) – true = erledigt */
function paintClick(ds, el, act) {
  if (ds.color) { PNT.c = ds.color; if (PNT.mode !== "fill") PNT.mode = "pen"; paintSync(); return true; }
  if (ds.mode) { PNT.mode = ds.mode; paintSync(); return true; }
  if (ds.width) { PNT.w = Number(ds.width); if (PNT.mode === "stamp" || PNT.mode === "fill") PNT.mode = "pen"; paintSync(); return true; }
  if (ds.stamp) { PNT.stamp = ds.stamp; PNT.mode = "stamp"; paintSync(); return true; }
  if (ds.delpic !== undefined) { ask("Dieses Bild löschen?", "Löschen", "Nein", "🗑️").then(ok => { if (!ok) return; const p = loadPics(); p.splice(Number(ds.delpic), 1); localStorage.setItem(picKey(), JSON.stringify(p)); renderPaint(); }); return true; }
  if (ds.shrpic !== undefined) { const src = loadPics()[Number(ds.shrpic)]; if (src) exportPic(src, true); return true; }
  if (ds.exppic !== undefined) { const src = loadPics()[Number(ds.exppic)]; if (src) exportPic(src); return true; }
  switch (act) {
    case "paint-undo": if (PAINT) PAINT.undo(); return true;
    case "paint-clear": if (PDOC && PDOC.shapes.length) ask("Alles wegmachen und neu anfangen?", "Ja, alles weg", "Nein", "🗑️").then(ok => { if (ok) { PDOC.shapes = []; renderPaint(); } }); return true;
    case "paint-share": if (!PAINT || !PDOC.shapes.length) { toast("Male zuerst etwas! 🖍️"); return true; } exportPic(PAINT.snapshot("image/jpeg", 0.9), true); return true;
    case "paint-save": savePaint(); return true;
    case "paint-tpl": pickTemplate(); return true;
    case "paint-full": pushLayer(() => paintFull(false)); paintFull(true); return true;
    case "paint-small": back(); return true;
    case "stamp-bigger": if (PAINT) PAINT.scaleSel(1.25); return true;
    case "stamp-smaller": if (PAINT) PAINT.scaleSel(0.8); return true;
  }
  return false;
}
