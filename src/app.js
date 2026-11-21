/* ======================= LERN-APP KLASSE 1–6 =======================
   Speicher: localStorage „lernapp_v1“ (alle Kinder), Bilder je Kind „lernapp_bilder_<id>“. */
"use strict";
const APP_VER = "1.5.0";
const STORE = "lernapp_v1";

/* ---------- Speicher ---------- */
function loadG() {
  let o = {};
  try { const r = localStorage.getItem(STORE); if (r) o = JSON.parse(r) || {}; } catch (e) { o = {}; }
  o.profiles = Array.isArray(o.profiles) ? o.profiles : [];
  o.data = o.data || {};
  o.set = Object.assign({ auto: true, sfx: true, voice: "", rate: 1, goal: 15 }, o.set || {});
  delete o.set.style; delete o.set.vmap; // Vorlese-Figuren gibt es seit 1.3 nicht mehr
  return o;
}
let G = loadG();
function save() {
  const d = G.cur && G.data[G.cur];
  if (d && Object.keys(d.rev).length > 700) { // älteste, gut gekonnte Einträge zuerst entfernen
    const ks = Object.entries(d.rev).sort((a, b) => (b[1].b - a[1].b) || (a[1].d - b[1].d)).slice(0, 100).map(x => x[0]);
    ks.forEach(k => delete d.rev[k]);
  }
  try { localStorage.setItem(STORE, JSON.stringify(G)); } catch (e) { toast("Speichern hat nicht geklappt (Speicher voll?)."); }
}
const P = () => G.profiles.find(p => p.id === G.cur) || null;
function D() {
  const p = P();
  if (!p) return null;
  const d = (G.data[p.id] = G.data[p.id] || {});
  d.xp = d.xp || 0; d.stars = d.stars || {}; d.plays = d.plays || {}; d.rev = d.rev || {}; d.hist = d.hist || {}; d.stk = d.stk || []; d.ok = d.ok || 0; d.all = d.all || 0;
  return d;
}
const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const dayNum = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
const todayN = () => (D() ? D().hist[dayStr()] || 0 : 0);
function streak() {
  const h = D().hist; let n = 0; const d = new Date();
  if (!h[dayStr(d)]) d.setDate(d.getDate() - 1);
  while (h[dayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const level = xp => ({ n: Math.floor(xp / 150) + 1, p: (xp % 150) / 150 });
const IVL = [0, 1, 2, 4, 8, 16];
const UNIT_IVL = [1, 3, 7, 14, 30];
function unitDue(uid) {
  const pl = D().plays[uid];
  if (!pl) return false;
  return dayNum() - pl.last >= UNIT_IVL[Math.min(pl.n - 1, 4)];
}
function revDue() { const t = dayNum(); return Object.values(D().rev).filter(r => r.d <= t && r.t); }

/* ---------- Helfer ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => (t.hidden = true), 2800); }
const fracHtml = s => s.replace(/(\d+)\/(\d+)/g, '<span class="frac"><i>$1</i><i>$2</i></span>');
const plain = s => String(s).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
function lev(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const starsHtml = n => `<span class="stars">${[1, 2, 3].map(i => `<span class="${n >= i ? "" : "off"}">⭐</span>`).join("")}</span>`;
const unitsFor = (area, cls) => UNITS.filter(u => u.area === area && u.cls === cls);

/* ======================= SPRACHE: Vorlesen ======================= */
let VOICES = [];
function loadVoices() { try { VOICES = (speechSynthesis.getVoices() || []).filter(v => /^de/i.test(v.lang)); } catch (e) { VOICES = []; } }
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", loadVoices); }
function pickVoice() {
  const own = G.set.voice && VOICES.find(v => v.name === G.set.voice);
  if (own) return own;
  const nice = v => /google|natural|enhanced|premium|neural/i.test(v.name);
  const de = VOICES.filter(v => /de[-_]DE/i.test(v.lang));
  return de.find(nice) || de[0] || VOICES.find(nice) || VOICES[0] || null;
}
const DEN = { 2: "Halbe", 3: "Drittel", 4: "Viertel", 5: "Fünftel", 6: "Sechstel", 7: "Siebtel", 8: "Achtel", 9: "Neuntel", 10: "Zehntel", 12: "Zwölftel", 100: "Hundertstel" };
function speechText(s) {
  return plain(s)
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\uFE0F\u200D]/gu, "").replace(/^[\s,]+/, "")
    .replace(/\bABC\b/g, "A B C")
    .replace(/[A-ZÄÖÜ]{3,}/g, w => (/^(SOS|USA|DNA|DNS|LKW|WC)$/.test(w) ? w : w.toLowerCase().replace(/^gross$/, "groß").replace(/^süss$/, "süß")))
    .replace(/(^|[\s(])-(\d)/g, "$1minus $2") // GROSSBUCHSTABEN-Wörter nicht buchstabieren
    .replace(/\((−?\d+)\)/g, "$1").replace(/\(([^()]*\d[^()]*)\)/g, " Klammer auf $1 Klammer zu ").replace(/ \+ /g, " plus ").replace(/\s*=\s*\?\s*$/g, " ist wie viel?").replace(/ = /g, " ist gleich ")
    .replace(/(\d+)\/(\d+)/g, (m, n, d) => (d === "2" && n === "1" ? "ein halb" : DEN[d] ? `${n === "1" ? "ein" : n} ${DEN[d]}` : `${n} durch ${d}`))
    .replace(/(\d) (\d)/g, "$1$2")
    .replace(/·/g, " mal ").replace(/(\d|\)) : (\d|\()/g, "$1 geteilt durch $2").replace(/−\s?(\d)/g, "minus $1").replace(/ − /g, " minus ")
    .replace(/ ≈ \?/g, ". Ungefähr wie viel?").replace(/≈/g, " ungefähr ").replace(/²/g, " hoch 2").replace(/³/g, " hoch 3").replace(/°C/g, " Grad").replace(/___/g, " … ")
    .replace(/→|–/g, ", ");
}
function say(text, rate = 1) {
  if (!text || !("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speechText(text)), v = pickVoice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : "de-DE";
    u.pitch = 1.05;
    u.rate = 0.9 * G.set.rate * rate;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const stopSay = () => { try { speechSynthesis.cancel(); } catch (e) {} };

/* ======================= SPRACHE: Spracherkennung (wie im Vokabelheft) ======================= */
function joinResults(results) {
  const parts = [];
  for (let i = 0; i < results.length; i++) {
    const t = String(results[i][0].transcript || "").trim();
    if (!t) continue;
    const last = parts.length ? parts[parts.length - 1].toLowerCase() : "";
    if (last && t.toLowerCase().startsWith(last)) parts[parts.length - 1] = t;
    else if (last && last.endsWith(t.toLowerCase())) continue;
    else parts.push(t);
  }
  return dedupeWords(parts.join(" "));
}
function dedupeWords(text) {
  let w = text.split(/\s+/).filter(Boolean), changed = true;
  while (changed) {
    changed = false;
    for (let n = Math.floor(w.length / 2); n >= 1 && !changed; n--)
      for (let i = 0; i + 2 * n <= w.length; i++) {
        const a = w.slice(i, i + n).join(" ").toLowerCase(), b = w.slice(i + n, i + 2 * n).join(" ").toLowerCase();
        if (a === b) { w.splice(i + n, n); changed = true; break; }
      }
  }
  return w.join(" ");
}
function webDict() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  let rec = null, done = null;
  const h = {};
  return {
    onPartial(fn) { h.p = fn; }, onFinal(fn) { h.f = fn; }, onState(fn) { h.s = fn; },
    start(opts = {}) {
      return new Promise((ok, no) => {
        try {
          let reason = "stopped", full = "";
          rec = new SR(); rec.lang = opts.lang || "de-DE"; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 3;
          h.s && h.s({ state: "starting" });
          rec.onstart = () => { h.s && h.s({ state: "listening" }); ok(); };
          rec.onresult = e => {
            full = joinResults(e.results);
            const alts = []; const last = e.results[e.results.length - 1];
            for (let i = 0; i < last.length; i++) alts.push(String(last[i].transcript || ""));
            h.alts = alts;
            h.p && h.p({ text: full });
          };
          rec.onerror = e => { reason = e.error === "not-allowed" || e.error === "service-not-allowed" ? "not_granted" : e.error === "no-speech" || e.error === "aborted" ? "stopped" : "upstream_error"; if (reason !== "stopped") no({ code: reason }); };
          rec.onend = () => { rec = null; if (full) { h.f && h.f({ text: full, alts: h.alts || [] }); } h.s && h.s({ state: "idle", reason, heard: !!full }); if (done) { done(); done = null; } };
          rec.start();
        } catch (e) { rec = null; no({ code: "unavailable" }); }
      });
    },
    stop() { return new Promise(ok => { if (!rec) return ok(); done = ok; try { rec.stop(); } catch (e) { done = null; ok(); } setTimeout(() => { if (done) { done(); done = null; } }, 2500); }); }
  };
}
let DICT = null, MIC = null; // MIC = { btn, onText }
function initDict() {
  DICT = webDict();
  if (!DICT) return;
  DICT.onPartial(p => { const h = $("#heard"); if (h && MIC) h.innerHTML = `Ich höre: <b>${esc(p.text)}</b>`; });
  DICT.onFinal(f => { if (MIC && MIC.onText) MIC.onText(f.text, f.alts); });
  DICT.onState(s => {
    if (s.state !== "idle") return;
    document.querySelectorAll(".mic.on").forEach(b => b.classList.remove("on"));
    if (MIC && !s.heard && s.reason === "stopped") { const h = $("#heard"); if (h) h.textContent = "Ich habe nichts gehört. Tippe nochmal auf 🎤 und sprich laut."; }
    MIC = null;
  });
}
async function listen(btn, onText) {
  if (!DICT) { toast("Spracherkennung gibt es in diesem Browser nicht. Am besten Chrome benutzen."); return; }
  if (MIC) { DICT.stop(); return; }
  stopSay();
  MIC = { btn, onText };
  btn.classList.add("on");
  const h = $("#heard"); if (h) h.textContent = "Ich höre zu …";
  try { await DICT.start({ lang: "de-DE" }); }
  catch (e) {
    btn.classList.remove("on"); MIC = null;
    toast(e && e.code === "not_granted" ? "Bitte erlaube das Mikrofon für diese Seite (Schloss-Symbol in der Adresszeile)." : "Die Spracherkennung klappt gerade nicht. Ist das Internet an?");
  }
}
function stopListen() { if (MIC && DICT) DICT.stop(); MIC = null; }

/* gesprochene Antworten prüfen */
const normDe = s => String(s).toLowerCase().replace(/[.,!?;:"„“”'’…()]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
const FILL = new Set("der die das den dem ein eine einen ist es sind zwei viele ich glaube äh ähm hm ja ok und".split(" "));
function speechMatch(heard, answers) {
  const h = normDe(heard), toks = h.split(" ").filter(w => !FILL.has(w));
  for (const a of answers) {
    const v = normDe(a);
    if (!v) continue;
    if ((" " + h + " ").includes(" " + v + " ")) return true;
    if (!v.includes(" ")) { for (const w of toks) { const tol = v.length >= 9 ? 2 : v.length >= 4 ? 1 : 0; if (lev(w, v) <= tol) return true; } }
    else if (lev(toks.join(" "), v) <= Math.floor(v.length / 6)) return true;
  }
  return false;
}
/* „vierundzwanzig“ → 24, „minus drei“ → -3, „zwei Komma fünf“ → 2.5 */
const NW = [["siebzehn", 17], ["sechzehn", 16], ["dreizehn", 13], ["vierzehn", 14], ["fünfzehn", 15], ["achtzehn", 18], ["neunzehn", 19], ["zwanzig", 20], ["dreißig", 30], ["dreissig", 30], ["vierzig", 40], ["fünfzig", 50], ["sechzig", 60], ["siebzig", 70], ["achtzig", 80], ["neunzig", 90], ["hundert", "H"], ["tausend", "T"], ["millionen", "M"], ["million", "M"], ["zwölf", 12], ["sieben", 7], ["sechs", 6], ["eins", 1], ["eine", 1], ["ein", 1], ["zwei", 2], ["zwo", 2], ["drei", 3], ["vier", 4], ["fünf", 5], ["acht", 8], ["neun", 9], ["zehn", 10], ["elf", 11], ["null", 0], ["und", "U"]];
function wordsToInt(s) {
  let total = 0, cur = 0, any = false, i = 0;
  while (i < s.length) {
    const m = NW.find(([w]) => s.startsWith(w, i));
    if (!m) return null;
    i += m[0].length; any = true;
    const v = m[1];
    if (v === "U") continue;
    if (v === "H") cur = (cur || 1) * 100;
    else if (v === "T") { total += (cur || 1) * 1000; cur = 0; }
    else if (v === "M") { total += (cur || 1) * 1e6; cur = 0; }
    else cur += v;
  }
  return any ? total + cur : null;
}
function parseSpokenNum(text) {
  let s = normDe(text).replace(/(\d)\s+(?=\d{3}\b)/g, "$1").replace(/(\d)\.(\d{3})/g, "$1$2");
  const neg = /\bminus\b|^−|^-/.test(s);
  const dm = s.match(/-?\d+(?:[.,]\d+)?/);
  if (dm) { const n = Number(dm[0].replace(",", ".")); return neg && n > 0 ? -n : n; }
  s = s.replace(/\bminus\b/g, "").replace(/\s+/g, "");
  const [a, b] = s.split("komma");
  const ia = wordsToInt(a || "");
  if (ia === null) return null;
  let n = ia;
  if (b) { const digs = [...b].length ? b : ""; const ib = wordsToInt(digs); if (ib !== null) n = Number(ia + "." + ib); }
  return neg ? -n : n;
}

/* ---------- Töne ---------- */
let AC = null;
function tone(notes, type = "sine", gap = 0.09, len = 0.22, vol = 0.12) {
  if (!G.set.sfx) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime;
    notes.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * gap);
      g.gain.exponentialRampToValueAtTime(vol, t + i * gap + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * gap + len);
      o.connect(g).connect(AC.destination); o.start(t + i * gap); o.stop(t + i * gap + len + 0.03);
    });
  } catch (e) {}
}
const sfx = ok => (ok ? tone([660, 880, 1320]) : tone([260, 200], "triangle", 0.12, 0.25));
const fanfare = () => tone([523, 659, 784, 1047, 784, 1047], "sine", 0.12, 0.28, 0.1);
function confetti(n = 26) {
  const c = document.createElement("div"); c.className = "confetti";
  const set = ["⭐", "🎉", "🌟", "✨", "🎈", "💛"];
  for (let i = 0; i < n; i++) { const s = document.createElement("span"); s.textContent = pick(set); s.style.left = Math.random() * 100 + "vw"; s.style.animationDuration = 1.6 + Math.random() * 1.6 + "s"; s.style.animationDelay = Math.random() * 0.5 + "s"; c.appendChild(s); }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 4000);
}

/* ======================= NAVIGATION (Zurück-Taste des Handys) ======================= */
let VIEW = { v: "home" };
const STACK = [];
function pushLayer(close) { STACK.push(close); history.pushState({ n: STACK.length }, ""); }
function back() { if (STACK.length) history.back(); else { VIEW = { v: "home" }; render(); } }
addEventListener("popstate", () => { const c = STACK.pop(); if (c) c(); });
function go(v) {
  const prev = VIEW;
  pushLayer(() => { VIEW = prev; render(); });
  VIEW = v; render(); scrollTo(0, 0);
}

/* ======================= BILDSCHIRME ======================= */
const app = () => $("#app");
function render() {
  if (SES) return;
  const p = P();
  if (!p || VIEW.v === "who") return renderWho();
  if (VIEW.v === "edit") return renderEdit(VIEW.id);
  if (VIEW.v === "area") return renderArea();
  if (VIEW.v === "prog") return renderProg();
  if (VIEW.v === "paint") return renderPaint();
  if (VIEW.v === "rev") return renderRev();
  if (VIEW.v === "set") return renderSet();
  renderHome();
}

function renderWho() {
  if (!G.profiles.length) return renderEdit(null);
  app().innerHTML = `<div class="wrap">
    <div class="mascot"><div class="owl">🦉</div><div class="bubble">Hallo! Ich bin <b>Lumi</b>. Wer lernt heute mit mir?</div></div>
    <div class="who">${G.profiles.map(p => `<button data-prof="${p.id}"><span class="e">${p.av}</span><b>${esc(p.name)}</b><span class="muted">Klasse ${p.cls}</span></button>`).join("")}
    <button class="add" data-act="new-prof"><span class="e">➕</span><b>Neues Kind</b></button></div></div>`;
}
let FORM = null;
function renderEdit(id) {
  const p = id ? G.profiles.find(x => x.id === id) : null;
  if (!FORM || FORM.id !== (id || "new")) FORM = { id: id || "new", name: p ? p.name : "", cls: p ? p.cls : 1, av: p ? p.av : pick(AVATARS) };
  app().innerHTML = `<div class="wrap">
    <div class="head">${G.profiles.length ? `<button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button>` : ""}<div class="t">${p ? "Profil ändern" : "Neues Kind"}</div></div>
    ${G.profiles.length ? "" : `<div class="mascot"><div class="owl">🦉</div><div class="bubble">Hallo! Ich bin <b>Lumi</b>, die Lern-Eule. Wie heißt du?</div></div>`}
    <div class="card form">
      <label>Name<input type="text" id="fName" maxlength="14" value="${esc(FORM.name)}" placeholder="z. B. Mia" autocomplete="off"></label>
      <label>Klasse<div class="seg" id="fCls">${[1, 2, 3, 4, 5, 6].map(k => `<button data-cls="${k}" aria-pressed="${FORM.cls === k}">${k}</button>`).join("")}</div></label>
      <label>Mein Tier<div class="seg avas" id="fAv">${AVATARS.map(a => `<button data-av="${a}" aria-pressed="${FORM.av === a}">${a}</button>`).join("")}</div></label>
      <button class="btn green wide" data-act="save-prof">${p ? "Speichern" : "Los geht's! 🚀"}</button>
      ${p ? `<button class="btn ghost small" data-act="del-prof">🗑️ Profil löschen</button>` : ""}
    </div></div>`;
  $("#fName").addEventListener("input", e => (FORM.name = e.target.value));
}

function suggestion() {
  const p = P(), d = D(), due = revDue().length;
  if (due >= 6) return { kind: "rev", icon: "🔁", t: "Wiederholen", s: `${due} Aufgaben warten auf dich` };
  const order = AREAS.map(a => a.id), rot = dayNum() % order.length;
  const areas = order.slice(rot).concat(order.slice(0, rot));
  for (const a of areas) { const u = unitsFor(a, p.cls).find(x => !d.stars[x.id]); if (u) return { kind: "unit", u }; }
  const dueU = UNITS.find(u => u.cls === p.cls && unitDue(u.id));
  if (dueU) return { kind: "unit", u: dueU, again: true };
  const weak = UNITS.filter(u => u.cls === p.cls).sort((a, b) => (d.stars[a.id] || 0) - (d.stars[b.id] || 0))[0];
  return weak ? { kind: "unit", u: weak, again: true } : null;
}
function renderHome() {
  const p = P(), d = D(), lv = level(d.xp), tn = todayN(), goal = G.set.goal, due = revDue().length;
  const sug = suggestion();
  const msgs = tn >= goal ? [`Super, ${esc(p.name)}! Dein Tagesziel ist geschafft! 🎉`] : tn ? [`Weiter so, ${esc(p.name)}! Noch ${goal - tn} Aufgaben bis zum Tagesziel.`] : [`Hallo ${esc(p.name)}! Schön, dass du da bist. Was möchtest du lernen?`, `Hallo ${esc(p.name)}! Lust auf ein bisschen Lernen?`];
  const areaTiles = AREAS.map(a => {
    const us = unitsFor(a.id, p.cls);
    if (!us.length) return "";
    const st = us.reduce((s, u) => s + (d.stars[u.id] || 0), 0);
    return `<button class="tile c-${a.c}" data-area="${a.id}"><span class="ic">${a.icon}</span><span><b>${a.name}</b><small>⭐ ${st} von ${us.length * 3}</small></span></button>`;
  }).join("");
  app().innerHTML = `<div class="wrap">
    <div class="top"><button class="ava" data-act="who" aria-label="Kind wechseln">${p.av}</button>
      <div class="hello sp"><b>${esc(p.name)}</b><span class="pill">🎒 Klasse ${p.cls}</span> <span class="pill">🏅 Level ${lv.n}</span></div>
      <button class="icon-btn" data-go="set" aria-label="Einstellungen">⚙️</button></div>
    <div class="mascot"><div class="owl">🦉</div><div class="bubble">${pick(msgs)}</div></div>
    <div class="stats">
      <div class="stat"><b>⭐ ${Object.values(d.stars).reduce((a, b) => a + b, 0)}</b><span>Sterne</span></div>
      <div class="stat"><b>🔥 ${streak()}</b><span>Tage in Folge</span></div>
      <div class="stat"><b>🎯 ${Math.min(tn, goal)}/${goal}</b><span>Heute</span><div class="goal"><i style="width:${Math.min(100, (tn / goal) * 100)}%"></i></div></div>
    </div>
    ${sug ? `<button class="today" ${sug.kind === "rev" ? 'data-act="rev-start"' : `data-unit="${sug.u.id}"`}><span class="ic">${sug.kind === "rev" ? "🔁" : sug.u.icon}</span><span><small>${sug.kind === "rev" ? "Heute dran" : sug.again ? "Nochmal üben" : "Heute dran"}</small><b>${sug.kind === "rev" ? sug.t : esc(sug.u.name)}</b><small>${sug.kind === "rev" ? sug.s : AREA[sug.u.area].name}</small></span></button>` : ""}
    <div class="tiles">${areaTiles}
      <button class="tile c-pink" data-go="rev"><span class="ic">🔁</span><span><b>Wiederholen</b><small>Fehler und alte Aufgaben</small></span>${due ? `<span class="badge">${due}</span>` : ""}</button>
      <button class="tile c-grn" data-go="prog"><span class="ic">🏆</span><span><b>Mein Fortschritt</b><small>Sterne und Sticker</small></span></button>
      <button class="tile c-sky" data-go="paint" style="--c:#8f7cf0"><span class="ic">🎨</span><span><b>Malen</b><small>Male ein Bild</small></span></button>
    </div>
    <div class="sec"><h3>Andere Klassen</h3></div>
    <div class="muted">Du kannst auch Sachen aus anderen Klassen üben: Tippe auf ein Fach und dann oben auf die Klasse.</div>
    ${AREAS.some(a => !unitsFor(a.id, p.cls).length) ? `<div class="chips" style="margin-top:10px">${AREAS.filter(a => !unitsFor(a.id, p.cls).length).map(a => `<button class="chip" data-area="${a.id}">${a.icon} ${a.name}</button>`).join("")}</div>` : ""}
  </div>`;
}

function renderArea() {
  const p = P(), d = D(), a = AREA[VIEW.a];
  const classes = [1, 2, 3, 4, 5, 6].filter(k => unitsFor(a.id, k).length);
  let cls = VIEW.cls || p.cls;
  if (!classes.includes(cls)) cls = classes.reduce((b, k) => (Math.abs(k - p.cls) < Math.abs(b - p.cls) ? k : b), classes[0]);
  VIEW.cls = cls;
  const us = unitsFor(a.id, cls);
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">${a.icon} ${a.name}</div></div>
    <div class="chips">${classes.map(k => `<button class="chip" data-cls-view="${k}" aria-pressed="${k === cls}">Klasse ${k}</button>`).join("")}</div>
    <div class="units">${us.map(u => `<button class="unit" data-unit="${u.id}" style="--c:var(--${a.c})"><span class="ic">${u.icon}</span><span class="sp"><span class="n">${esc(u.name)}</span>${starsHtml(d.stars[u.id] || 0)}${unitDue(u.id) ? ` <span class="due">🔁 mal wieder üben</span>` : ""}</span><span style="font-size:26px">▶️</span></button>`).join("")}</div>
    ${a.id === "wort" && !DICT ? `<div class="note" style="margin-top:14px">🎤 In diesem Browser gibt es keine Spracherkennung. Du kannst die Antworten antippen. Zum Sprechen am besten Chrome benutzen.</div>` : ""}
  </div>`;
}

function renderRev() {
  const d = D(), due = revDue(), t = dayNum();
  const wrong = Object.values(d.rev).filter(r => r.b === 0 && r.t).length;
  const dueUnits = UNITS.filter(u => d.plays[u.id] && unitDue(u.id));
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">🔁 Wiederholen</div></div>
    <div class="mascot"><div class="owl">🦉</div><div class="bubble">${due.length ? `Hier sind Aufgaben, die du üben solltest. ${wrong ? `Bei <b>${wrong}</b> davon hattest du noch einen Fehler.` : ""}` : "Super! Gerade wartet keine Aufgabe auf dich. 🎉"}</div></div>
    ${due.length ? `<button class="btn green wide" data-act="rev-start">Jetzt wiederholen (${Math.min(12, due.length)} Aufgaben)</button>` : ""}
    ${dueUnits.length ? `<div class="sec"><h3>Schon länger nicht geübt</h3></div><div class="units">${dueUnits.slice(0, 8).map(u => `<button class="unit" data-unit="${u.id}" style="--c:var(--${AREA[u.area].c})"><span class="ic">${u.icon}</span><span class="sp"><span class="n">${esc(u.name)}</span><span class="muted">${AREA[u.area].name} · Klasse ${u.cls} · vor ${t - d.plays[u.id].last} Tagen</span></span>${starsHtml(d.stars[u.id] || 0)}</button>`).join("")}</div>` : ""}
    <div class="sec"><h3>So funktioniert's</h3></div>
    <div class="card muted">Was du falsch hattest, kommt bald wieder. Was du richtig hattest, kommt immer später wieder: nach 1, 2, 4, 8 und 16 Tagen. So bleibt alles gut im Kopf! 🧠</div>
  </div>`;
}

function lvlClass(r) { if (!r) return ""; if (r.b === 0) return "w"; return r.b >= 5 ? "l3" : r.b >= 3 ? "l2" : "l1"; }
function renderProg() {
  const p = P(), d = D(), lv = level(d.xp), rv = d.rev;
  const days = [...Array(7)].map((_, i) => { const x = new Date(); x.setDate(x.getDate() - 6 + i); return { n: d.hist[dayStr(x)] || 0, l: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][x.getDay()], t: i === 6 }; });
  const mx = Math.max(10, ...days.map(x => x.n));
  const areas = AREAS.map(a => {
    const us = unitsFor(a.id, p.cls);
    if (!us.length) return "";
    const st = us.reduce((s, u) => s + (d.stars[u.id] || 0), 0), done = us.filter(u => d.stars[u.id]).length;
    return `<div class="prog-area" style="--c:var(--${a.c})"><div class="row"><b>${a.icon} ${a.name}</b><span class="sp"></span><span class="muted">${done} von ${us.length} Lektionen · ⭐ ${st}</span></div><div class="bar"><i style="width:${(st / (us.length * 3)) * 100}%"></i></div></div>`;
  }).join("");
  const letters = [...ABC, "Ä", "Ö", "Ü"].map(ch => { const r = [rv["B:" + ch], rv["S:" + ch], rv["F:" + ch]].filter(Boolean).sort((a, b) => b.b - a.b)[0]; return `<span class="${lvlClass(r)}">${ch}</span>`; }).join("");
  const nums = [...Array(21)].map((_, n) => `<span class="${lvlClass(rv["Z:" + n] || rv["S:" + n] || rv["F:" + n])}">${n}</span>`).join("");
  let x1 = "<b></b>" + [...Array(10)].map((_, i) => `<b>${i + 1}</b>`).join("");
  for (let a = 1; a <= 10; a++) { x1 += `<b>${a}</b>`; for (let b = 1; b <= 10; b++) { const r = rv[`${a}·${b}`] || rv[`${b}·${a}`]; x1 += `<span class="${lvlClass(r)}">${a * b}</span>`; } }
  const known = Object.values(rv).filter(r => r.b >= 3).length;
  const legend = `<div class="legend"><span><i style="background:#eef3f8"></i>noch nicht geübt</span><span><i style="background:#fff1c2"></i>geübt</span><span><i style="background:#c9f2d9"></i>kann ich</span><span><i style="background:var(--ok)"></i>kann ich super</span><span><i style="background:var(--badbg);box-shadow:inset 0 0 0 2px var(--bad)"></i>nochmal üben</span></div>`;
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">🏆 Mein Fortschritt</div></div>
    <div class="card"><div class="row"><span class="ava">${p.av}</span><div class="sp"><b style="font-size:22px">${esc(p.name)}</b><div class="muted">Klasse ${p.cls} · Level ${lv.n} · ${d.xp} Punkte</div><div class="bar" style="margin-top:6px;--c:var(--sun)"><i style="width:${lv.p * 100}%"></i></div></div></div></div>
    <div class="stats" style="margin-top:14px">
      <div class="stat"><b>✅ ${d.ok}</b><span>richtig</span></div><div class="stat"><b>🧠 ${known}</b><span>sitzt schon</span></div><div class="stat"><b>🔥 ${streak()}</b><span>Tage in Folge</span></div></div>
    <div class="card"><h3>Diese Woche</h3><div class="week" style="margin-top:10px">${days.map(x => `<div class="${x.t ? "t" : ""}"><i style="height:${(x.n / mx) * 80}px"></i>${x.l}<br>${x.n}</div>`).join("")}</div></div>
    <div class="sec"><h3>Meine Fächer (Klasse ${p.cls})</h3></div><div class="card">${areas}</div>
    ${p.cls <= 2 || Object.keys(rv).some(k => /^[BSF]:/.test(k)) ? `<div class="sec"><h3>🔤 Buchstaben</h3></div><div class="card"><div class="lgrid">${letters}</div>${legend}</div>
    <div class="sec"><h3>🔢 Zahlen bis 20</h3></div><div class="card"><div class="lgrid">${nums}</div></div>` : ""}
    ${p.cls >= 2 ? `<div class="sec"><h3>✖️ Einmaleins</h3></div><div class="card"><div class="x1">${x1}</div>${legend}</div>` : ""}
    <div class="sec"><h3>📒 Mein Sticker-Album (${d.stk.length} von ${STICKERS.length})</h3></div>
    <div class="card"><div class="album">${STICKERS.map(s => (d.stk.includes(s) ? `<span>${s}</span>` : `<span class="no">?</span>`)).join("")}</div>
      <div class="muted" style="margin-top:8px">Für jede Übung mit 2 oder 3 Sternen bekommst du einen neuen Sticker.</div></div>
  </div>`;
}

function renderSet() {
  const p = P(), s = G.set;
  const sw = (k, on) => `<button class="switch" data-toggle="${k}" aria-pressed="${!!on}" aria-label="umschalten"></button>`;
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">⚙️ Einstellungen</div></div>
    <div class="card">
      <div class="set-row"><span class="row"><span class="ava" style="width:46px;height:46px;font-size:28px">${p.av}</span><span><b>${esc(p.name)}</b><br><span class="muted">Klasse ${p.cls}</span></span></span><button class="btn small ghost" data-act="edit-prof">Ändern</button></div>
      <div class="set-row"><span>Anderes Kind</span><button class="btn small ghost" data-act="who">Wechseln</button></div>
    </div>
    <div class="sec"><h3>Hören und Sprechen</h3></div>
    <div class="card">
      <div class="set-row"><span>Aufgaben automatisch vorlesen</span>${sw("auto", s.auto)}</div>
      <div class="set-row"><span>Töne</span>${sw("sfx", s.sfx)}</div>
      <div class="set-row"><span>Stimme</span><select id="voiceSel"><option value="">Automatisch</option>${VOICES.map(v => `<option value="${esc(v.name)}" ${v.name === s.voice ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div>
      <div class="set-row"><span>Sprechtempo</span><div class="seg">${[[0.8, "🐢"], [1, "🙂"], [1.15, "🐇"]].map(([r, l]) => `<button data-rate="${r}" aria-pressed="${s.rate === r}">${l}</button>`).join("")}</div></div>
      <div class="set-row"><span>Probe hören</span><button class="btn small ghost" data-act="test-voice">🔊 Hallo!</button></div>
      <div class="set-row"><span>Spracherkennung</span><span class="muted">${DICT ? "✅ bereit" : "❌ nicht in diesem Browser (Chrome benutzen)"}</span></div>
    </div>
    <div class="sec"><h3>Tagesziel</h3></div>
    <div class="card"><div class="seg">${[10, 15, 20, 30].map(g => `<button data-goal="${g}" aria-pressed="${s.goal === g}">${g}</button>`).join("")}</div><div class="muted" style="margin-top:8px">Aufgaben pro Tag</div></div>
    <div class="sec"><h3>Sicherung (für Eltern)</h3></div>
    <div class="card">
      <div class="muted">Der Fortschritt wird auf diesem Gerät gespeichert. Mit einer Sicherungs-Datei kannst du ihn aufheben oder auf ein anderes Handy bringen.</div>
      <div class="padbar" style="justify-content:flex-start"><button class="btn small" data-act="backup">💾 Sicherung speichern</button><button class="btn small ghost" data-act="restore">📂 Sicherung laden</button></div>
      <input type="file" id="restoreFile" accept=".json,application/json" hidden>
    </div>
    <div class="sec"><h3>App weitergeben</h3></div>
    <div class="card">
      <div class="muted">Die App ist kostenlos und braucht keine Anmeldung. Jedes Handy, das den Link öffnet, hat seine eigene App mit eigenem Fortschritt – nichts wird geteilt.</div>
      <div class="padbar" style="justify-content:flex-start"><button class="btn small" data-act="share-app">📤 Link teilen</button></div>
    </div>
    <p class="muted" style="text-align:center;margin-top:22px">Lern-App Klasse 1–6 · Version ${APP_VER}</p>
  </div>`;
  $("#voiceSel").addEventListener("change", e => { G.set.voice = e.target.value; save(); say("Hallo! Ich bin Lumi, die Lern-Eule."); });
  $("#restoreFile").addEventListener("change", e => { const f = e.target.files[0]; if (f) restore(f); });
}
function backup() {
  const blob = new Blob([JSON.stringify({ app: "lernapp-klasse-1-6", v: 1, date: new Date().toISOString(), G }, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `lernapp-sicherung-${dayStr()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast("Sicherung gespeichert (im Download-Ordner).");
}
function restore(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = JSON.parse(r.result);
      if (!o || o.app !== "lernapp-klasse-1-6" || !o.G || !Array.isArray(o.G.profiles)) throw 0;
      ask(`Sicherung vom ${esc(String(o.date || "").slice(0, 10))} laden?<br><small>Der jetzige Stand wird ersetzt.</small>`, "Laden", "Abbrechen", "📂").then(ok => {
        if (!ok) return;
        localStorage.setItem(STORE, JSON.stringify(o.G));
        G = loadG(); if (!P()) G.cur = G.profiles[0] && G.profiles[0].id;
        toast("Sicherung geladen."); VIEW = { v: "home" }; render();
      });
    } catch (e) { toast("Diese Datei ist keine Sicherung der Lern-App."); }
  };
  r.readAsText(file);
}

/* ---------- eigenes Frage-Fenster (das Fenster des Browsers zeigt die Internet-Adresse an) ---------- */
function ask(msg, ok = "Ja", cancel = "Nein", icon = "🦉") {
  return new Promise(res => {
    const d = document.createElement("div");
    d.className = "modal";
    d.innerHTML = `<div class="modal-box"><div class="v-emo" style="font-size:56px">${icon}</div><div class="modal-msg">${msg}</div><div class="padbar"><button class="btn ghost" data-m="0">${cancel}</button><button class="btn orange" data-m="1">${ok}</button></div></div>`;
    d.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (b || e.target === d) { e.stopPropagation(); d.remove(); res(!!b && b.dataset.m === "1"); } });
    document.body.appendChild(d);
  });
}
/* App-Link weitergeben (jedes Handy hat dann seine eigene App mit eigenem Fortschritt) */
async function shareApp() {
  const url = location.href.split(/[?#]/)[0].replace(/index\.html$/, "");
  try { if (navigator.share) { await navigator.share({ title: "Lern-App Klasse 1–6", text: "Kostenlose Lern-App für Kinder (Klasse 1–6):", url }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(url); toast("Link kopiert – jetzt z. B. in WhatsApp einfügen."); } catch (e) { toast(url); }
}

/* ======================= MALEN ======================= */
const PAINT_COLORS = ["#23324a", "#f2554f", "#ff9532", "#ffbf1f", "#5ec94d", "#1fbf9f", "#3a9cff", "#9a78ff", "#ff64ab", "#8b5a2b", "#ffffff"];
const STAMPS = ["⭐", "❤️", "🌸", "🐞", "☀️", "🌈", "🦋", "🐟"];
let PNT = { c: "#3a9cff", w: 10, stamp: null };
const picKey = () => "lernapp_bilder_" + G.cur;
function loadPics() { try { return JSON.parse(localStorage.getItem(picKey()) || "[]"); } catch (e) { return []; } }
function renderPaint() {
  const pics = loadPics();
  app().innerHTML = `<div class="wrap">
    <div class="head"><button class="icon-btn" data-act="back" aria-label="Zurück">⬅️</button><div class="t">🎨 Malen</div></div>
    <div class="paint-main">
      <button class="btn green" data-act="paint-save">💾 Speichern</button>
      <button class="btn wa" data-act="paint-share">💬 Schicken</button>
      <button class="btn ghost" data-act="paint-clear">🧽 Neu</button>
    </div>
    <div class="paint-tools">${PAINT_COLORS.map(c => `<button class="sw" data-color="${c}" style="background:${c}" aria-pressed="${!PNT.stamp && PNT.c === c}" aria-label="Farbe"></button>`).join("")}</div>
    <div class="paint-tools">${[[5, "•"], [10, "●"], [22, "⬤"]].map(([w, l]) => `<button class="tool" data-width="${w}" aria-pressed="${PNT.w === w}">${l}</button>`).join("")}
      ${STAMPS.map(s => `<button class="tool" data-stamp="${s}" aria-pressed="${PNT.stamp === s}">${s}</button>`).join("")}</div>
    <canvas class="paint" id="paintCv"></canvas>
    <div class="padbar"><button class="btn ghost small" data-act="paint-undo">↩️ Letzten Strich weg</button></div>
    ${pics.length ? `<div class="sec"><h3>Meine Bilder</h3></div><div class="muted" style="margin-bottom:8px">📥 = aufs Handy speichern · 💬 = verschicken (z. B. WhatsApp) · ✖ = löschen</div><div class="gallery">${pics.map((src, i) => `<figure><img src="${src}" alt="Bild ${i + 1}"><button data-delpic="${i}" aria-label="Löschen">✖</button><button class="exp" data-exppic="${i}" aria-label="Aufs Handy speichern">📥</button><button class="shr" data-shrpic="${i}" aria-label="Teilen">💬</button></figure>`).join("")}</div>` : ""}
  </div>`;
  initPaint();
}
let PAINT = null;
function initPaint() {
  const cv = $("#paintCv"), ctx = cv.getContext("2d");
  const old = PAINT && PAINT.shapes ? PAINT.shapes : [];
  PAINT = { cv, ctx, shapes: old, cur: null };
  const size = () => { const r = cv.getBoundingClientRect(), dpr = devicePixelRatio || 1; cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); PAINT.W = r.width; PAINT.H = r.height; draw(); };
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / PAINT.W, (e.clientY - r.top) / PAINT.H]; };
  function draw() {
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, PAINT.W, PAINT.H);
    ctx.lineCap = ctx.lineJoin = "round";
    for (const s of PAINT.shapes) {
      if (s.stamp) { ctx.font = `${Math.round(PAINT.W * 0.11)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s.stamp, s.p[0] * PAINT.W, s.p[1] * PAINT.H); continue; }
      ctx.strokeStyle = ctx.fillStyle = s.c; ctx.lineWidth = s.w;
      polyline(ctx, s.pts.map(([x, y]) => [x * PAINT.W, y * PAINT.H]), 0, s.w);
    }
  }
  PAINT.draw = draw; PAINT.resize = size;
  cv.addEventListener("pointerdown", e => {
    e.preventDefault(); cv.setPointerCapture(e.pointerId);
    if (PNT.stamp) { PAINT.shapes.push({ stamp: PNT.stamp, p: pos(e) }); tone([880], "sine", 0, 0.1, 0.05); draw(); return; }
    PAINT.cur = { c: PNT.c, w: PNT.w, pts: [pos(e)] }; PAINT.shapes.push(PAINT.cur); draw();
  });
  cv.addEventListener("pointermove", e => { if (!PAINT.cur) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const ev of evs) PAINT.cur.pts.push(pos(ev)); draw(); });
  const up = () => (PAINT.cur = null);
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  size();
}
/* Bild aufs Handy: Teilen-Menü (z. B. Google Fotos oder ein Ordner in „Dateien“), sonst Download-Ordner */
async function exportPic(src, share = false) {
  try {
    const blob = await (await fetch(src)).blob();
    const d = new Date(), name = `Lern-App-Bild-${dayStr(d)}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}.${blob.type === "image/png" ? "png" : "jpg"}`;
    const file = new File([blob], name, { type: blob.type });
    if (share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share(share ? { files: [file], title: "Mein Bild", text: `Schau mal, was ich gemalt habe! 🎨 ${P() ? "– " + P().name : ""}` } : { files: [file], title: "Mein Bild" }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (share) toast("Verschicken geht hier nicht direkt. Das Bild liegt im Ordner „Downloads“ – in WhatsApp über 📎 anhängen.");
    return true;
  } catch (e) { toast("Speichern hat nicht geklappt."); }
}
function savePaint() { // in „Meine Bilder“ und als Bild-Datei aufs Handy (Ordner „Downloads“)
  if (!PAINT || !PAINT.shapes.length) return toast("Male zuerst etwas! 🖍️");
  const src = PAINT.cv, w = 480, h = Math.round((src.height / src.width) * w), c = document.createElement("canvas");
  c.width = w; c.height = h; c.getContext("2d").drawImage(src, 0, 0, w, h);
  const pics = loadPics(); pics.unshift(c.toDataURL("image/jpeg", 0.72));
  while (pics.length > 12) pics.pop();
  try { localStorage.setItem(picKey(), JSON.stringify(pics)); } catch (e) { pics.pop(); try { localStorage.setItem(picKey(), JSON.stringify(pics.slice(0, 6))); } catch (e2) {} }
  exportPic(src.toDataURL("image/png")).then(ok => { if (ok) toast("Gespeichert! 🖼️ Unter „Meine Bilder“ und auf dem Handy im Ordner „Downloads“."); });
  PAINT.shapes = []; confetti(14); tone([523, 659, 784]); renderPaint();
}

/* ======================= ÜBEN ======================= */
let SES = null;
const PRAISE = ["Super!", "Toll gemacht!", "Klasse!", "Richtig!", "Prima!", "Spitze!", "Genau!", "Wow, sehr gut!", "Perfekt!"];
function startUnit(uid) {
  const u = UNIT[uid];
  let tasks = [];
  try { tasks = u.gen(); } catch (e) { console.error(e); }
  if (!tasks.length) return toast("Hier gibt es gerade keine Aufgaben.");
  openSession({ uid, title: u.name, icon: u.icon, tasks });
}
function startReview() {
  const due = revDue().sort((a, b) => a.b - b.b || a.d - b.d).slice(0, 12);
  if (!due.length) return toast("Gerade gibt es nichts zu wiederholen. 🎉");
  openSession({ uid: "rev", title: "Wiederholen", icon: "🔁", tasks: shuffle(due.map(r => JSON.parse(JSON.stringify(r.t)))) });
}
function openSession(o) {
  SES = { ...o, i: 0, ok: 0, n: o.tasks.length, xp: 0, tries: 0, answered: false, again: 0 };
  $("#ses").hidden = false; document.body.style.overflow = "hidden";
  if (!STACK.some(c => c.ses)) { const c = () => closeSession(); c.ses = true; pushLayer(c); }
  showTask();
}
function closeSession() {
  stopSay(); stopListen(); hideFb();
  SES = null; PADS = null;
  $("#ses").hidden = true; document.body.style.overflow = "";
  render();
}
const curT = () => SES.tasks[SES.i];

function showTask() {
  let t = curT();
  if (t.type === "speak" && !DICT) { t = SES.tasks[SES.i] = { ...t.fb, key: t.key }; }
  SES.tries = 0; SES.answered = false; SES.inp = ""; PADS = null;
  hideFb(); stopListen();
  const pct = (SES.i / SES.tasks.length) * 100;
  $("#sesTrack").innerHTML = `<i style="width:${pct}%"></i><span style="left:${Math.max(6, Math.min(94, pct))}%">🦉</span>`;
  $("#sesCount").textContent = `${Math.min(SES.i + 1, SES.tasks.length)}/${SES.tasks.length}`;
  const head = `<div class="qcard"><button class="say-btn" data-act="say" aria-label="Vorlesen">🔊</button><div class="qtext ${t.cls || ""}">${fracHtml(t.cls === "calc" ? t.q.replace(/\?/g, '<span class="qbox">?</span>') : t.q)}</div>${t.vis || ""}${t.again ? `<div class="muted">Diese Aufgabe nochmal 💪</div>` : ""}</div>`;
  let body = "";
  if (t.type === "choice") {
    SES.opts = shuffle(t.opts);
    const ot = t.ot || "word", long = ot === "word" && SES.opts.some(o => o.length > 16);
    body = `<div class="opts ${ot} n${SES.opts.length}${long ? " long" : ""}">${SES.opts.map((o, i) => `<button class="opt" data-opt="${i}">${fracHtml(esc(o))}</button>`).join("")}</div>`;
  } else if (t.type === "num") {
    const fn = t.neg ? "−" : t.dec ? "," : "";
    body = `<div class="row" style="margin-bottom:12px">${DICT ? `<button class="mic small" data-act="mic-num" aria-label="Zahl sagen">🎤</button>` : ""}<div class="ans sp" id="ans" style="margin:0"><span class="ph">?</span></div></div>
      <div class="heard" id="heard" ${DICT ? "" : "hidden"}></div>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button data-k="${k}">${k}</button>`).join("")}<button class="fn" data-k="${fn || "c"}">${fn || "🧽"}</button><button data-k="0">0</button><button class="fn" data-k="del" aria-label="Löschen">⌫</button><button class="go" data-k="ok" style="grid-column:1/-1">Fertig ✓</button></div>`;
  } else if (t.type === "speak") {
    body = `<button class="mic" data-act="mic-speak" aria-label="Sprechen">🎤</button><div class="heard" id="heard">Tippe auf das Mikrofon und sprich laut.</div><button class="link" data-act="tap-instead">Lieber antippen</button>`;
  } else if (t.type === "trace" || t.type === "write") {
    body = `<div class="padwrap"><canvas class="draw" id="pad"></canvas></div><div id="tstars" class="tstars"></div>
      <div class="padbar">${t.type === "trace" ? `<button class="btn ghost small" data-act="demo">👀 Zeig mir</button>` : ""}<button class="btn ghost small" data-act="pad-clear">🧽 Löschen</button><button class="btn green" data-act="pad-check">Fertig ✓</button></div>`;
  } else if (t.type === "type") {
    body = `<div class="padbar" style="margin:-4px 0 14px"><button class="btn small" data-act="say">🔊 Nochmal hören</button><button class="btn small ghost" data-act="say-slow">🐢 Langsam</button></div>
      <input class="textin" id="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Hier schreiben …">
      <div class="padbar"><button class="btn green wide" data-act="type-check">Prüfen ✓</button></div><div id="diff" class="diff" style="text-align:center;margin-top:10px"></div>`;
  }
  $("#sesBody").innerHTML = head + body;
  $("#sesBody").scrollTop = 0;
  if (t.type === "trace" || t.type === "write") PADS = makePad($("#pad"), t);
  if (t.type === "type") { const inp = $("#tin"); inp.addEventListener("keydown", e => { if (e.key === "Enter") checkType(); }); }
  if (G.set.auto || t.autoSay) setTimeout(() => { if (SES && curT() === t) say(introSpeech(t)); }, 300);
}

/* Was beim Start einer Aufgabe vorgelesen wird */
function introSpeech(t) {
  const q = plain(t.q);
  let txt = t.say || q;
  // Hör-Aufgaben (z. B. „Welche Zahl hörst du?“): erst die Frage, dann das Gehörte
  if (t.autoSay && t.say && t.say !== q) txt = q + " … " + t.say;
  // Klasse 1–2: Antwort-Wörter mit vorlesen, weil viele Kinder noch nicht gut lesen
  const p = P();
  if (t.type === "choice" && (t.ot || "word") === "word" && p && p.cls <= 2 && SES && SES.opts) {
    const o = SES.opts.map(x => speechText(x).trim()).filter(Boolean);
    const same = new Set(o.map(x => x.toLowerCase())).size < o.length;
    if (!same && o.length > 1 && o.join(" ").length < 120) txt += " … " + o.slice(0, -1).join(", ") + " oder " + o[o.length - 1] + "?";
  }
  return txt;
}

/* ---- Antworten ---- */
function maxTries(t) { if (t.type === "choice") return t.opts.length <= 2 ? 1 : 2; if (t.type === "speak") return 2; return 2; }
function wrong(msg) {
  const t = curT();
  SES.tries++;
  if (SES.tries >= maxTries(t)) return finish(false);
  sfx(false);
  showFb("try", `<div class="msg"><span class="owl">🦉</span>${msg || "Fast! Versuch es nochmal."}</div>`, false);
  setTimeout(() => { if (SES && !SES.answered) hideFb(); }, 1800);
}
function answerText(t) {
  if (t.type === "speak") return esc(t.word);
  if (t.type === "trace" || t.type === "write") return esc(t.g);
  if (t.type === "type") return esc(t.a);
  if (t.type === "num") return esc(fmtN(Number(t.a)));
  return fracHtml(esc(t.a));
}
function record(t, ok) {
  const d = D();
  d.all++; if (ok) d.ok++;
  const k = dayStr(); d.hist[k] = (d.hist[k] || 0) + 1;
  if (t.key) {
    const r = d.rev[t.key] || { b: 0, d: 0, n: 0, w: 0 };
    r.n++;
    if (ok) r.b = Math.min(5, r.b + 1); else { r.b = 0; r.w++; }
    r.d = dayNum() + IVL[r.b];
    const copy = { ...t }; delete copy.again; r.t = copy;
    d.rev[t.key] = r;
  }
}
function finish(ok, extra = "") {
  const t = curT();
  if (SES.answered) return;
  SES.answered = true; stopListen();
  const first = ok && SES.tries === 0;
  if (!t.again) { record(t, first); if (first) SES.ok++; SES.xp += first ? 10 : ok ? 5 : 0; }
  else SES.xp += ok ? 3 : 0;
  if (!first && !t.again && SES.again < 5) { SES.again++; SES.tasks.push({ ...t, again: true }); }
  save();
  sfx(ok);
  if (t.labels) markLabels(t);
  if (ok) {
    const p = pick(PRAISE);
    showFb("ok", `<div class="msg"><span class="owl">🦉</span>${p}</div>${extra}${t.type === "choice" && t.hint && SES.tries ? `<div class="sub">${esc(t.hint)}</div>` : ""}`);
    if (G.set.auto) say(p);
  } else {
    if (t.type === "choice") document.querySelectorAll(".opt").forEach((b, i) => { if (SES.opts[i] === t.a) b.classList.add("ok"); b.disabled = true; });
    if (t.type === "trace" || t.type === "write") PADS && PADS.showSolution();
    showFb("bad", `<div class="msg"><span class="owl">🦉</span>Schau mal, so ist es richtig:</div><div class="sub sol">${answerText(t)}</div>${extra}${t.hint ? `<div class="sub">💡 ${esc(t.hint)}</div>` : ""}`);
    say(solutionSpeech(t));
  }
}
/* richtige Lösung zum Vorlesen (nie „undefined“: Schreib-Aufgaben haben ihre Lösung in t.g) */
function solutionSpeech(t) {
  if (t.type === "speak") return t.word || "";
  if (t.type === "trace" || t.type === "write") return t.g || "";
  if (t.ot === "emoji") return (t.labels && t.labels[t.a]) || "";
  return t.a == null ? "" : plain(t.a);
}
function markLabels(t) { document.querySelectorAll(".opt").forEach((b, i) => { const l = t.labels[SES.opts[i]]; if (l && !b.querySelector(".lab")) b.insertAdjacentHTML("beforeend", `<span class="lab">${esc(l)}</span>`); }); }
function choose(i, el) {
  const t = curT();
  if (SES.answered || el.disabled) return;
  const o = SES.opts[i];
  if (o === t.a) { el.classList.add("ok"); document.querySelectorAll(".opt").forEach(b => (b.disabled = true)); finish(true); }
  else { el.classList.add("bad"); el.disabled = true; wrong(); }
}
function numKey(k) {
  if (SES.answered) return;
  const t = curT();
  if (k === "ok") return checkNum();
  if (k === "del") SES.inp = SES.inp.slice(0, -1);
  else if (k === "c") SES.inp = "";
  else if (k === "−") SES.inp = SES.inp.startsWith("−") ? SES.inp.slice(1) : "−" + SES.inp;
  else if (k === ",") { if (!SES.inp.includes(",")) SES.inp = (SES.inp || "0") + ","; }
  else if (SES.inp.replace(/\D/g, "").length < 9) SES.inp += k;
  void t; showInp();
}
function showInp(cls = "") { const a = $("#ans"); if (!a) return; a.className = "ans sp " + cls; a.innerHTML = SES.inp ? esc(SES.inp) : `<span class="ph">?</span>`; }
const numVal = s => Number(String(s).replace("−", "-").replace(",", "."));
function checkNum() {
  const t = curT();
  if (!SES.inp || SES.inp === "−") return toast("Tippe zuerst eine Zahl ein.");
  if (Math.abs(numVal(SES.inp) - Number(t.a)) < 1e-9) { showInp("ok"); finish(true); }
  else { showInp("bad"); SES.inp = ""; setTimeout(() => SES && !SES.answered && showInp(), 600); wrong(); }
}
function micNum(btn) {
  listen(btn, text => {
    const n = parseSpokenNum(text);
    const h = $("#heard"); if (h) h.innerHTML = `Ich habe gehört: <b>${esc(text)}</b>`;
    if (n === null || isNaN(n)) { if (h) h.innerHTML += " – das ist keine Zahl. Nochmal?"; return; }
    SES.inp = fmtN(n).replace(/ /g, ""); showInp(); checkNum();
  });
}
function micSpeak(btn) {
  const t = curT();
  listen(btn, (text, alts) => {
    const h = $("#heard"); if (h) h.innerHTML = `Ich habe gehört: <b>${esc(text)}</b>`;
    const ok = [text, ...(alts || [])].some(x => speechMatch(x, t.a));
    if (ok) finish(true, `<div class="sub">Du hast gesagt: „${esc(text)}“</div>`);
    else wrong(`Hmm, ich habe „${esc(text)}“ verstanden. Versuch es nochmal!`);
  });
}
function tapInstead() {
  const t = curT();
  if (!t.fb) return;
  stopListen();
  SES.tasks[SES.i] = { ...t.fb, key: t.key, again: t.again };
  const tries = SES.tries; showTask(); SES.tries = tries;
}
function checkType() {
  const t = curT(), inp = $("#tin");
  if (SES.answered) return;
  const v = inp.value.trim();
  if (!v) return toast("Schreib zuerst das Wort.");
  if (v === t.a) { inp.style.borderColor = "var(--ok)"; finish(true); return; }
  const close = lev(v.toLowerCase(), t.a.toLowerCase());
  const hint = v.toLowerCase() === t.a.toLowerCase() ? "Fast! Achte auf groß und klein." : close <= 1 ? "Fast! Nur ein Buchstabe stimmt nicht." : "Hör nochmal genau hin!";
  if (SES.tries + 1 >= maxTries(t)) {
    $("#diff").innerHTML = `Du: ${[...v].map((c, i) => (t.a[i] === c ? esc(c) : `<span class="x">${esc(c)}</span>`)).join("")}`;
    return wrong();
  }
  inp.select(); say(t.a, 0.8); wrong(hint);
}
function nextTask() {
  if (!SES) return;
  SES.i++;
  if (SES.i >= SES.tasks.length) return showResult();
  showTask();
}
function showResult() {
  const d = D(), r = SES.n ? SES.ok / SES.n : 0, st = r >= 0.9 ? 3 : r >= 0.7 ? 2 : 1;
  stopSay(); hideFb();
  d.xp += SES.xp;
  let sticker = null;
  if (SES.uid !== "rev") {
    d.stars[SES.uid] = Math.max(d.stars[SES.uid] || 0, st);
    const pl = d.plays[SES.uid] || { n: 0 };
    d.plays[SES.uid] = { n: pl.n + 1, last: dayNum() };
  }
  if (st >= 2) { const free = STICKERS.filter(s => !d.stk.includes(s)); if (free.length) { sticker = pick(free); d.stk.push(sticker); } }
  save();
  $("#sesTrack").innerHTML = `<i style="width:100%"></i><span style="left:94%">🦉</span>`;
  const msg = st === 3 ? "Fantastisch! Du bist ein Star!" : st === 2 ? "Sehr gut gemacht!" : "Gut geübt! Beim nächsten Mal klappt es noch besser.";
  $("#sesBody").innerHTML = `<div class="result">
    <div class="v-emo">🦉</div><h1>${msg}</h1>
    <div class="big-stars">${[1, 2, 3].map(i => `<span style="${st >= i ? "" : "filter:grayscale(1);opacity:.25"}">⭐</span>`).join("")}</div>
    <p style="font-size:20px">${SES.ok} von ${SES.n} gleich beim ersten Mal richtig<br><b>+${SES.xp} Punkte</b></p>
    ${sticker ? `<div class="card" style="margin:16px 0"><div class="muted">Neuer Sticker für dein Album!</div><div class="sticker-new">${sticker}</div></div>` : ""}
    <div class="padbar" style="flex-direction:column;align-items:stretch">
      ${SES.uid !== "rev" ? `<button class="btn orange wide" data-act="again">🔄 Nochmal üben</button>` : ""}
      <button class="btn green wide" data-act="ses-done">Fertig ✓</button></div></div>`;
  if (st >= 2) { confetti(); fanfare(); } else tone([523, 659]);
  if (G.set.auto) say(msg);
}
function showFb(kind, html, withNext = true) {
  const f = $("#fb");
  f.className = "fb show " + kind;
  f.innerHTML = `<div class="fb-in">${html}${withNext ? `<button class="btn ${kind === "ok" ? "green" : "orange"} wide" data-act="next">Weiter ➜</button>` : ""}</div>`;
}
function hideFb() { const f = $("#fb"); if (f) f.className = "fb"; }

/* ======================= SCHREIBFLÄCHE (Nachspuren / frei schreiben) ======================= */
let PADS = null;
function makePad(cv, t) {
  const ctx = cv.getContext("2d"), lay = layoutText(t.g), trace = t.type === "trace";
  const kid = [];
  let cur = null, demo = null, sol = false, s = 1, ox = 0, oy = 0, W = 0, H = 0;
  function size() {
    const r = cv.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lw = trace ? lay.w : Math.max(lay.w, 64);
    s = Math.min((W - 28) / lw, (H - 12) / 102);
    ox = (W - lay.w * s) / 2; oy = (H - 100 * s) / 2 + 4 * s;
    draw();
  }
  const toG = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left - ox) / s, (e.clientY - r.top - oy) / s]; };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const Y = gy => oy + gy * s;
    ctx.fillStyle = "#fff7d1"; ctx.fillRect(0, Y(40), W, Y(70) - Y(40));
    for (const [y, c, w] of [[10, "#bcd5ee", 1.5], [40, "#bcd5ee", 1.5], [70, "#ef8f8f", 2.2], [92, "#bcd5ee", 1.5]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, Y(y)); ctx.lineTo(W, Y(y)); ctx.stroke(); }
    ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s); ctx.lineCap = ctx.lineJoin = "round";
    if (trace || sol) {
      ctx.strokeStyle = ctx.fillStyle = sol && !trace ? "rgba(34,180,107,.28)" : "#e4dcf8"; ctx.lineWidth = 15;
      for (const it of lay.items) for (const st of it.g.strokes) polyline(ctx, st.pts, it.x, st.dot ? 17 : 15);
      ctx.setLineDash([2, 4]); ctx.lineWidth = 1.2; ctx.strokeStyle = "#a493dc";
      for (const it of lay.items) for (const st of it.g.strokes) if (!st.dot) polyline(ctx, st.pts, it.x, 1.2);
      ctx.setLineDash([]);
      if (trace) for (const it of lay.items) it.g.strokes.forEach((st, k) => {
        const [x0, y0] = st.pts[0], j = Math.min(st.pts.length - 1, 6), [x1, y1] = st.pts[j], a = Math.atan2(y1 - y0, x1 - x0);
        ctx.fillStyle = "#22b46b"; ctx.beginPath(); ctx.arc(x0 + it.x, y0, 4.6, 0, Math.PI * 2); ctx.fill();
        if (!st.dot) { ctx.save(); ctx.translate(x0 + it.x + Math.cos(a) * 8, y0 + Math.sin(a) * 8); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(-2, -2.6); ctx.lineTo(-2, 2.6); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.fillStyle = "#fff"; ctx.font = "600 6px Fredoka, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(k + 1), x0 + it.x, y0 + 0.4);
      });
    }
    ctx.strokeStyle = ctx.fillStyle = "#2e6be6"; ctx.lineWidth = 8;
    for (const st of kid) polyline(ctx, st, 0, 8);
    if (demo) {
      let left = demo.p;
      ctx.strokeStyle = ctx.fillStyle = "#ff9532"; ctx.lineWidth = 9;
      for (const it of lay.items) for (const st of it.g.strokes) {
        if (left <= 0) break;
        const n = Math.min(st.pts.length, Math.ceil(left));
        polyline(ctx, st.pts.slice(0, n), it.x, 9);
        if (left < st.pts.length) { const [px, py] = st.pts[n - 1]; ctx.font = "16px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("✏️", px + it.x - 2, py + 4); }
        left -= st.pts.length + 8;
      }
    }
    ctx.restore();
  }
  cv.addEventListener("pointerdown", e => { if (SES.answered) return; e.preventDefault(); cv.setPointerCapture(e.pointerId); demo = null; cur = [toG(e)]; kid.push(cur); draw(); });
  cv.addEventListener("pointermove", e => {
    if (!cur) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) { const p = toG(ev), l = cur[cur.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 0.7) cur.push(p); }
    draw();
  });
  const up = () => { cur = null; };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  requestAnimationFrame(size);
  return {
    clear() { kid.length = 0; draw(); $("#tstars").textContent = ""; },
    demo() {
      const total = lay.items.reduce((a, it) => a + it.g.strokes.reduce((b, st) => b + st.pts.length + 8, 0), 0), t0 = performance.now();
      const step = now => { if (!demo) return; demo.p = ((now - t0) / 1000) * 45; draw(); if (demo.p < total) requestAnimationFrame(step); else setTimeout(() => { demo = null; draw(); }, 600); };
      demo = { p: 0 }; requestAnimationFrame(step); say(t.say || t.q);
    },
    showSolution() { sol = true; draw(); },
    resize: size,
    check() {
      if (!kid.length) return toast(trace ? "Fahr mit dem Finger über die graue Linie. ☝️" : "Schreib mit dem Finger in das Feld. ☝️");
      if (trace) {
        const r = traceScore(lay, kid), q = Math.min(r.cov, r.prec);
        if (r.cov >= 0.72 && r.prec >= 0.68) {
          const st = q >= 0.9 ? 3 : q >= 0.8 ? 2 : 1;
          $("#tstars").innerHTML = starsHtml(st);
          finish(true);
        } else {
          const why = r.cov < 0.72 ? "Fahr die ganze Linie nach – es fehlt noch ein Stück." : "Bleib mehr auf der grauen Linie.";
          kid.length = 0; draw(); wrong(why);
        }
      } else {
        const len = kid.reduce((a, st) => a + st.length, 0);
        if (len < 6) return toast("Schreib ein bisschen größer. ✍️");
        const res = recognize(kid, t.set);
        const ok = res[0].ch === t.g || (res[1] && res[1].ch === t.g && res[1].d <= res[0].d * 1.15);
        if (ok) finish(true);
        else { kid.length = 0; draw(); wrong(`Hmm, das sieht eher aus wie „${res[0].ch}“. Versuch es nochmal!`); }
      }
    }
  };
}

/* ======================= KLICKS ======================= */
document.addEventListener("click", e => {
  const el = e.target.closest("button, [data-act]");
  if (!el) return;
  const ds = el.dataset;
  if (ds.opt !== undefined && SES) return choose(Number(ds.opt), el);
  if (ds.k !== undefined && SES) return numKey(ds.k);
  if (ds.unit) return startUnit(ds.unit);
  if (ds.area) return go({ v: "area", a: ds.area });
  if (ds.go) return go({ v: ds.go });
  if (ds.prof) { G.cur = ds.prof; save(); STACK.length = 0; VIEW = { v: "home" }; return render(); }
  if (ds.clsView) { VIEW.cls = Number(ds.clsView); return renderArea(); }
  if (ds.cls) { FORM.cls = Number(ds.cls); document.querySelectorAll("#fCls button").forEach(b => b.setAttribute("aria-pressed", b === el)); return; }
  if (ds.av) { FORM.av = ds.av; document.querySelectorAll("#fAv button").forEach(b => b.setAttribute("aria-pressed", b === el)); return; }
  if (ds.toggle) { G.set[ds.toggle] = !G.set[ds.toggle]; save(); el.setAttribute("aria-pressed", G.set[ds.toggle]); return; }
  if (ds.rate) { G.set.rate = Number(ds.rate); save(); renderSet(); say("So schnell spreche ich jetzt."); return; }
  if (ds.goal) { G.set.goal = Number(ds.goal); save(); return renderSet(); }
  if (ds.color) { PNT.c = ds.color; PNT.stamp = null; document.querySelectorAll("[data-color],[data-stamp]").forEach(b => b.setAttribute("aria-pressed", b === el)); return; }
  if (ds.width) { PNT.w = Number(ds.width); PNT.stamp = null; document.querySelectorAll("[data-width]").forEach(b => b.setAttribute("aria-pressed", b === el)); document.querySelectorAll("[data-stamp]").forEach(b => b.setAttribute("aria-pressed", false)); return; }
  if (ds.stamp) { PNT.stamp = ds.stamp; document.querySelectorAll("[data-stamp],[data-color],[data-width]").forEach(b => b.setAttribute("aria-pressed", b === el)); return; }
  if (ds.delpic !== undefined) { ask("Dieses Bild löschen?", "Löschen", "Nein", "🗑️").then(ok => { if (!ok) return; const p = loadPics(); p.splice(Number(ds.delpic), 1); localStorage.setItem(picKey(), JSON.stringify(p)); renderPaint(); }); return; }
  if (ds.shrpic !== undefined) { const src = loadPics()[Number(ds.shrpic)]; if (src) exportPic(src, true); return; }
  if (ds.exppic !== undefined) { const src = loadPics()[Number(ds.exppic)]; if (src) exportPic(src); return; }
  switch (ds.act) {
    case "back": return back();
    case "who": G.cur = null; save(); STACK.length = 0; VIEW = { v: "home" }; return render();
    case "new-prof": FORM = null; return go({ v: "edit", id: null });
    case "edit-prof": FORM = null; return go({ v: "edit", id: G.cur });
    case "save-prof": {
      const name = FORM.name.trim();
      if (!name) { toast("Bitte gib einen Namen ein."); return $("#fName").focus(); }
      let p = FORM.id !== "new" && G.profiles.find(x => x.id === FORM.id);
      if (p) Object.assign(p, { name, cls: FORM.cls, av: FORM.av });
      else { p = { id: "k" + Date.now().toString(36), name, cls: FORM.cls, av: FORM.av }; G.profiles.push(p); }
      G.cur = p.id; save(); FORM = null; STACK.length = 0; VIEW = { v: "home" }; render(); scrollTo(0, 0);
      return say(`Hallo ${name}! Los geht's!`);
    }
    case "del-prof": {
      const p = G.profiles.find(x => x.id === FORM.id);
      if (!p) return;
      ask(`Profil von <b>${esc(p.name)}</b> mit allem Fortschritt löschen?`, "Löschen", "Nein", "🗑️").then(ok => {
        if (!ok) return;
        G.profiles = G.profiles.filter(x => x !== p); delete G.data[p.id];
        try { localStorage.removeItem("lernapp_bilder_" + p.id); } catch (e2) {}
        G.cur = null; save(); FORM = null; STACK.length = 0; VIEW = { v: "home" }; render();
      });
      return;
    }
    case "rev-start": return startReview();
    case "test-voice": return say(`Hallo ${P() ? P().name : ""}! Ich bin Lumi, die Lern-Eule.`);
    case "backup": return backup();
    case "restore": return $("#restoreFile").click();
    case "paint-undo": if (PAINT) { PAINT.shapes.pop(); PAINT.draw(); } return;
    case "paint-clear": if (PAINT && PAINT.shapes.length) ask("Alles wegmachen und neu anfangen?", "Ja, alles weg", "Nein", "🧽").then(ok => { if (ok) { PAINT.shapes = []; PAINT.draw(); } }); return;
    case "paint-export": if (!PAINT || !PAINT.shapes.length) return toast("Male zuerst etwas! 🖍️"); return exportPic(PAINT.cv.toDataURL("image/png"));
    case "paint-share": if (!PAINT || !PAINT.shapes.length) return toast("Male zuerst etwas! 🖍️"); return exportPic(PAINT.cv.toDataURL("image/png"), true);
    case "share-app": return shareApp();
    case "paint-save": return savePaint();
  }
  if (!SES) return;
  const t = curT();
  switch (ds.act) {
    case "quit": return back();
    case "say": return say(t.say || t.q);
    case "say-slow": return say(t.say || t.q, 0.65);
    case "next": return nextTask();
    case "mic-num": return micNum(el);
    case "mic-speak": return micSpeak(el);
    case "tap-instead": return tapInstead();
    case "demo": return PADS && PADS.demo();
    case "pad-clear": return PADS && PADS.clear();
    case "pad-check": return SES.answered ? nextTask() : PADS && PADS.check();
    case "type-check": return checkType();
    case "again": { const uid = SES.uid; SES = null; return startUnit(uid); }
    case "ses-done": return back();
  }
});
let RZ = 0;
addEventListener("resize", () => { clearTimeout(RZ); RZ = setTimeout(() => { if (PADS && SES) PADS.resize(); if (PAINT && VIEW.v === "paint" && !SES && document.contains(PAINT.cv)) PAINT.resize(); }, 150); });

/* ======================= START ======================= */
initDict();
if (G.cur && !P()) G.cur = null;
render();
