/* ======================= AUFGABEN-GENERATOREN =======================
   Jede Lektion (Unit) erzeugt bei jedem Start neue, zufällige Aufgaben.
   Aufgaben-Arten: choice (antippen), num (Zahl eintippen/sagen), speak (sprechen), trace (nachspuren),
   write (frei schreiben), type (Diktat). Alle Aufgaben sind reine Daten (JSON), damit sie fürs Wiederholen gespeichert werden können. */

/* ---------- kleine Helfer ---------- */
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => (a * b) / gcd(a, b);
const pad2 = n => String(n).padStart(2, "0");
const list = s => s.split(",").map(x => x.trim()).filter(Boolean);
function fmtN(n) { // 482315 → „482 315“, 2.5 → „2,5“, -3 → „−3“
  const neg = n < 0; n = Math.abs(n);
  let [i, d] = String(Math.round(n * 1000) / 1000).split(".");
  if (i.length >= 5) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "−" : "") + i + (d ? "," + d : "");
}
const frs = (n, d) => `${n}/${d}`;
function uniqTasks(n, f) {
  const out = [], seen = new Set();
  for (let k = 0; out.length < n && k < n * 12; k++) {
    const t = f(out.length);
    if (!t) continue;
    const id = t.q + "|" + (t.vis || "") + "|" + (t.a || t.g) + "|" + (t.say || "");
    if (seen.has(id)) continue;
    seen.add(id); out.push(t);
  }
  return out;
}
/* Auswahl-Aufgabe: richtige Antwort + falsche (doppelte werden entfernt, max. 4) */
function C(q, a, wrong, o = {}) {
  const opts = [String(a)];
  for (const w of wrong) { const s = String(w); if (!opts.includes(s) && opts.length < (o.max || 4)) opts.push(s); }
  return { type: "choice", q, a: String(a), opts, ...o };
}
const N = (q, a, o = {}) => ({ type: "num", q, a: String(a), ...o });
function nearNums(a, f, min = 0, cnt = 3) {
  const s = new Set();
  for (let k = 0; s.size < cnt && k < 80; k++) { const c = f(); if (c !== a && c >= min) s.add(c); }
  return [...s];
}
const OPW = { "+": "plus", "−": "minus", "·": "mal", ":": "geteilt durch" };
function calc(a, op, b, o = {}) {
  const r = op === "+" ? a + b : op === "−" ? a - b : op === "·" ? a * b : a / b;
  return N(`${fmtN(a)} ${op} ${fmtN(b)} = ?`, Math.round(r * 1000) / 1000, { cls: "calc", say: `Wie viel ist ${a} ${OPW[op]} ${b}?`, key: `${a}${op}${b}`, ...o });
}

/* ---------- Bilder / Darstellungen (HTML) ---------- */
const EMO = ["🍎", "⭐", "🐞", "🎈", "🐟", "🌸", "🍓", "🐥", "⚽", "🍪"];
const V = {
  big: t => `<div class="v-big">${t}</div>`,
  word: t => `<div class="v-word">${t}</div>`,
  emo: (e, cap) => `<div class="v-emo">${e}</div>${cap ? `<div class="v-cap">${cap}</div>` : ""}`,
  count(e, n) { // in Fünfergruppen
    let h = "";
    for (let i = 0; i < n; i += 5) h += `<span class="grp">${e.repeat(Math.min(5, n - i))}</span>`;
    return `<div class="v-count">${h}</div>`;
  },
  field(n) { // Zwanzigerfeld
    let h = "";
    for (let r = 0; r < 2; r++) { h += `<div class="f-row">`; for (let i = 0; i < 10; i++) { const k = r * 10 + i; h += `<i class="${k < n ? "on" : ""}${i === 5 ? " gap" : ""}"></i>`; } h += `</div>`; }
    return `<div class="v-field">${h}</div>`;
  },
  tens(n) { // Zehnerstangen und Einerwürfel
    const t = Math.floor(n / 10), e = n % 10;
    return `<div class="v-tens">${"<b></b>".repeat(t)}<span class="ones">${"<i></i>".repeat(e)}</span></div>`;
  },
  hze(n) { // Hunderterplatten, Zehnerstangen, Einer
    const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), e = n % 10;
    return `<div class="v-tens">${"<u></u>".repeat(h)}${"<b></b>".repeat(t)}<span class="ones">${"<i></i>".repeat(e)}</span></div>`;
  },
  pics(a, op, b, e) {
    if (op === "+") return `<div class="v-pics"><span>${e.repeat(a)}</span><em>+</em><span>${e.repeat(b)}</span></div>`;
    return `<div class="v-pics"><span>${e.repeat(a - b)}<s>${e.repeat(b)}</s></span></div>`;
  },
  house(total, a) {
    return `<div class="v-house"><div class="roof">${total}</div><div class="rooms"><span>${a}</span><span class="qbox">?</span></div></div>`;
  },
  clock(h, m) {
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    let nums = "";
    for (let i = 1; i <= 12; i++) { const a = (i * 30 * Math.PI) / 180; nums += `<text x="${50 + 36 * Math.sin(a)}" y="${50 - 36 * Math.cos(a) + 4}">${i}</text>`; }
    let ticks = "";
    for (let i = 0; i < 60; i++) { const a = (i * 6 * Math.PI) / 180, r1 = i % 5 ? 44 : 41; ticks += `<line x1="${50 + r1 * Math.sin(a)}" y1="${50 - r1 * Math.cos(a)}" x2="${50 + 46 * Math.sin(a)}" y2="${50 - 46 * Math.cos(a)}"/>`; }
    return `<svg class="v-clock" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" class="face"/><g class="ticks">${ticks}</g><g class="nums">${nums}</g>
      <line x1="50" y1="50" x2="50" y2="27" class="hh" transform="rotate(${ha} 50 50)"/><line x1="50" y1="50" x2="50" y2="12" class="mh" transform="rotate(${ma} 50 50)"/><circle cx="50" cy="50" r="3.5" class="pin"/></svg>`;
  },
  frac(n, d) { // Kuchen-Bild
    if (d === 1) return `<svg class="v-frac" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" class="${n ? "on" : ""}"/></svg>`;
    let h = "";
    for (let i = 0; i < d; i++) {
      const a0 = (i / d) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / d) * Math.PI * 2 - Math.PI / 2, big = 1 / d > 0.5 ? 1 : 0;
      h += `<path d="M50 50 L${50 + 45 * Math.cos(a0)} ${50 + 45 * Math.sin(a0)} A45 45 0 ${big} 1 ${50 + 45 * Math.cos(a1)} ${50 + 45 * Math.sin(a1)} Z" class="${i < n ? "on" : ""}"/>`;
    }
    return `<svg class="v-frac" viewBox="0 0 100 100">${h}</svg>`;
  },
  column(a, op, b) {
    const w = Math.max(String(a).length, String(b).length) + 1;
    const row = (s, pre = "") => `<tr><td class="op">${pre}</td>${[...String(s).padStart(w, " ")].map(c => `<td>${c.trim()}</td>`).join("")}</tr>`;
    return `<table class="v-col">${row(a)}${row(b, op)}<tr class="line"><td></td>${"<td>?</td>".repeat(w)}</tr></table>`;
  },
  rect(a, b) {
    const sc = 120 / Math.max(a, b), w = a * sc, h = b * sc;
    return `<svg class="v-rect" viewBox="-30 -24 ${w + 60} ${h + 48}"><rect x="0" y="0" width="${w}" height="${h}" rx="3"/><text x="${w / 2}" y="-8">${a} cm</text><text x="${w + 6}" y="${h / 2 + 5}" style="text-anchor:start">${b} cm</text></svg>`;
  },
  thermo(t) { return `<div class="v-emo">🌡️</div><div class="v-cap">${fmtN(t)} °C</div>`; }
};

/* ---------- Wörter (Bilder) ---------- */
const WL = {};
for (const [cat, s] of Object.entries(WORDS)) WL[cat] = s.split(";").map(l => { const [e, w, art, pl, alt] = l.split("|"); return { e, w, art, pl, alt: alt ? list(alt) : [], cat }; });
const ALLW = Object.values(WL).flat();
const PLURAL_ONLY = new Set(["Trauben", "Kirschen", "Nudeln", "Pommes", "Socken", "Handschuhe", "Blätter"]);
const KL1W = ["tiere", "obst", "essen", "fahr", "haus", "kleid"].flatMap(c => WL[c]);
const SHORTW = KL1W.filter(x => x.w.length <= 6 && /^[A-ZÄÖÜ][a-zäöüß]+$/.test(x.w));

/* ---------- Buchstaben ---------- */
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ANLW = {};
for (const [k, v] of Object.entries(ANL)) ANLW[k] = list(v).map(x => { const i = x.indexOf(" "); return { e: x.slice(0, i), w: x.slice(i + 1) }; });
const CONFUSE = { V: "FW", F: "V", C: "KZ", K: "CQ", Q: "K", Y: "JI", J: "Y", Z: "C", W: "V" };
function otherLetters(ch, n, pool = ABC) { return sample([...pool].filter(c => c !== ch && !(CONFUSE[ch] || "").includes(c) && !(CONFUSE[c] || "").includes(ch)), n); }
const Ll = ch => ch + ch.toLowerCase();
function letterTask(ch, kinds) {
  const k = pick(kinds.filter(x => (x !== "anl" && x !== "pic") || ANLW[ch]));
  const key = "B:" + ch;
  if (k === "hear") return C("Welchen Buchstaben hörst du?", Ll(ch), otherLetters(ch, 3).map(Ll), { say: ch, ot: "big", key, autoSay: true });
  if (k === "anl") {
    const it = pick(ANLW[ch]);
    return C(`Womit fängt „${it.w}“ an?`, Ll(ch), otherLetters(ch, 3).map(Ll), { say: `${it.w}. Mit welchem Buchstaben fängt ${it.w} an?`, vis: V.emo(it.e), ot: "big", key, hint: `${it.e} ${it.w} fängt mit ${ch} an.` });
  }
  if (k === "pic") {
    const it = pick(ANLW[ch]);
    const wrong = otherLetters(ch, 3, Object.keys(ANLW).join("")).map(c => pick(ANLW[c]));
    return C(`Welches Bild fängt mit ${ch} an?`, it.e, wrong.map(x => x.e), { say: `Welches Bild fängt mit ${ch} an?`, vis: V.big(Ll(ch)), ot: "emoji", key, labels: Object.fromEntries([it, ...wrong].map(x => [x.e, x.w])), hint: `${it.e} ${it.w} fängt mit ${ch} an.` });
  }
  if (k === "case") return C(`Welcher kleine Buchstabe gehört zu ${ch}?`, ch.toLowerCase(), otherLetters(ch, 3).map(c => c.toLowerCase()), { say: `Welcher kleine Buchstabe gehört zum großen ${ch}?`, vis: V.big(ch), ot: "big", key });
  return C(`Welcher große Buchstabe gehört zu ${ch.toLowerCase()}?`, ch, otherLetters(ch, 3), { say: `Welcher große Buchstabe gehört zum kleinen ${ch}?`, vis: V.big(ch.toLowerCase()), ot: "big", key });
}
function letterTasks(letters, kinds, n = 10) {
  const L = shuffle([...letters]);
  return uniqTasks(n, i => letterTask(L[i % L.length], kinds));
}
function abcTask() {
  const i = R(1, 24), ch = ABC[i], k = R(0, 2);
  if (k === 0) return C(`Welcher Buchstabe kommt nach ${ch}?`, ABC[i + 1], [ABC[i - 1], ABC[i + 2] || "A", pick([...ABC])], { ot: "big", say: `Welcher Buchstabe kommt im ABC nach ${ch}?` });
  if (k === 1) return C(`Welcher Buchstabe kommt vor ${ch}?`, ABC[i - 1], [ABC[i + 1], ABC[i - 2] || "Z", pick([...ABC])], { ot: "big", say: `Welcher Buchstabe kommt im ABC vor ${ch}?` });
  return C("Welcher Buchstabe fehlt?", ch, [ABC[i + 1], ABC[i - 1], pick([...ABC])], { ot: "big", vis: V.big(`${ABC[i - 1]} <span class="qbox">?</span> ${ABC[i + 1]}`), say: `Welcher Buchstabe fehlt zwischen ${ABC[i - 1]} und ${ABC[i + 1]}?` });
}
function abcWordTask() {
  const ws = [];
  const used = new Set();
  for (const w of shuffle(SHORTW)) { if (used.has(w.w[0])) continue; used.add(w.w[0]); ws.push(w.w); if (ws.length === 4) break; }
  const first = ws.slice().sort((a, b) => a.localeCompare(b, "de"))[0];
  return C("Welches Wort kommt im ABC zuerst?", first, ws.filter(w => w !== first), { ot: "word", hint: "Schau auf den ersten Buchstaben: Was kommt im ABC früher?" });
}
const LAUT = list(LAUTE).map(x => { const [a, s] = x.split("|"); const i = a.indexOf(" "); return { e: a.slice(0, i), w: a.slice(i + 1), s }; });
function lautTask() {
  const it = pick(LAUT);
  const others = [...new Set(LAUT.map(x => x.s))].filter(s => s !== it.s);
  return C(`Womit fängt „${it.w}“ an?`, it.s, sample(others, 3), { vis: V.emo(it.e), say: `${it.w}. Womit fängt ${it.w} an?`, ot: "big", hint: `${it.w} fängt mit „${it.s}“ an.`, key: "L:" + it.w });
}
const UMLW = list(UML).map(x => { const [w, l, e] = x.split("|"); return { w, l, e }; });
const UMLOPT = { "ä": "a,ä,e,ö", "ö": "o,ö,ü,e", "ü": "u,ü,i,ö", "ß": "s,ss,ß,z", "Ä": "A,Ä,E,Ö" };
function umlTask() {
  const it = pick(UMLW), gap = it.w.replace(it.l, "_");
  return C("Welcher Buchstabe fehlt?", it.l, list(UMLOPT[it.l]).filter(x => x !== it.l), { vis: V.emo(it.e) + V.word(gap.replace("_", '<span class="qbox">?</span>')), say: `${it.w}. Welcher Buchstabe fehlt?`, ot: "big", hint: `Richtig geschrieben: ${it.w}`, key: "U:" + it.w });
}

/* ---------- Zahlen ---------- */
function countTask(max) {
  const n = R(1, max), e = pick(EMO);
  return N("Wie viele sind es?", n, { vis: n <= 10 ? V.count(e, n) : V.field(n), say: "Wie viele sind es? Zähle!", key: "Z:" + n });
}
function hearNumTask(min, max) {
  const n = R(min, max);
  return C("Welche Zahl hörst du?", n, nearNums(n, () => R(Math.max(min, n - 5), Math.min(max, n + 5)), min), { say: String(n), autoSay: true, ot: "big", key: "Z:" + n });
}
function biggerTask(max) {
  const a = R(0, max); let b = R(0, max); if (a === b) b = (a + R(1, 5)) % (max + 1);
  return C(`Welche Zahl ist größer?`, Math.max(a, b), [Math.min(a, b)], { ot: "big", say: `Welche Zahl ist größer: ${a} oder ${b}?`, max: 2 });
}
function neighborTask(max) {
  const n = R(1, max - 1), k = R(0, 2);
  if (k === 0) return N(`Welche Zahl kommt nach ${n}?`, n + 1, { vis: V.big(`${n} <span class="qbox">?</span>`), key: `NB:${n}+` });
  if (k === 1) return N(`Welche Zahl kommt vor ${n}?`, n - 1, { vis: V.big(`<span class="qbox">?</span> ${n}`), key: `NB:${n}-` });
  return N(`Welche Zahl liegt zwischen ${n - 1} und ${n + 1}?`, n, { vis: V.big(`${n - 1} <span class="qbox">?</span> ${n + 1}`) });
}
function cmpTask(min, max, dec = 0) {
  let a = R(min, max), b = R(min, max);
  if (dec) { a = a / 10 ** dec; b = b / 10 ** dec; }
  if (Math.random() < 0.15) b = a;
  const s = a < b ? "<" : a > b ? ">" : "=";
  return C("Welches Zeichen passt?", s, ["<", ">", "="].filter(x => x !== s), { vis: V.big(`${fmtN(a)} <span class="qbox">?</span> ${fmtN(b)}`), say: `Ist ${fmtN(a)} kleiner, größer oder gleich ${fmtN(b)}?`, ot: "big", hint: "Die Spitze zeigt immer zur kleineren Zahl. 🐊 Das Krokodil frisst die größere!" });
}
function seqTask(max, steps) {
  const st = pick(steps), down = max > 20 && Math.random() < 0.3;
  const start = down ? R(st * 4, max) : R(0, max - st * 4);
  const s = [0, 1, 2, 3].map(i => start + (down ? -st : st) * i), a = start + (down ? -st : st) * 4;
  return N("Wie geht die Reihe weiter?", a, { vis: V.big(s.join(", ") + ', <span class="qbox">?</span>'), say: `${s.join(", ")}. Welche Zahl kommt als Nächstes?`, hint: `Immer ${down ? "−" : "+"}${st}` });
}
function roman(n) { const v = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; for (const [k, r] of v) while (n >= k) { s += r; n -= k; } return s; }
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
function roundTo(n, p) { return Math.round(n / p) * p; }
const PLACE = [[1, "Einer"], [10, "Zehner"], [100, "Hunderter"], [1000, "Tausender"], [10000, "Zehntausender"], [100000, "Hunderttausender"]];

/* ---------- Rechnen ---------- */
function plusTask(max, cross) {
  let a, b;
  if (max <= 20) { a = R(1, max - 1); b = R(1, max - a); }
  else if (cross === "TT") { a = R(1, 9) * 10; b = R(1, (max - a) / 10 || 1) * 10; if (a + b > max) return null; }
  else { a = R(11, max - 11); b = R(2, Math.min(max - a, 89)); }
  if (cross === false && (a % 10) + (b % 10) >= 10) return null;
  if (cross === true && (a % 10) + (b % 10) < 10) return null;
  return calc(a, "+", b);
}
function minusTask(max, cross) {
  let a = R(max <= 20 ? 2 : 20, max), b = R(1, a - 1);
  if (max > 20 && cross === "TT") { a = R(2, max / 10) * 10; b = R(1, a / 10 - 1) * 10; }
  if (cross === false && (a % 10) < (b % 10)) return null;
  if (cross === true && (a % 10) >= (b % 10)) return null;
  return calc(a, "−", b);
}
function timeWord(h, m) {
  const nx = (h % 12) + 1;
  if (m === 0) return `${h} Uhr`;
  if (m === 30) return `halb ${nx}`;
  if (m === 15) return `Viertel nach ${h}`;
  if (m === 45) return `Viertel vor ${nx}`;
  return m < 30 ? `${m} nach ${h}` : `${60 - m} vor ${nx}`;
}
function clockTask(mins, words) {
  const h = R(1, 12), m = pick(mins), t = words ? timeWord(h, m) : `${h}:${pad2(m)}`;
  const wrong = new Set();
  for (let k = 0; wrong.size < 3 && k < 50; k++) {
    const h2 = pick([h, (h % 12) + 1, ((h + 10) % 12) + 1, R(1, 12)]), m2 = pick(mins.length > 1 ? mins : [m, (m + 30) % 60]);
    const w = words ? timeWord(h2, m2) : `${h2}:${pad2(m2)}`;
    if (w !== t) wrong.add(w);
  }
  return C("Wie spät ist es?", t, [...wrong], { vis: V.clock(h, m), ot: "word", hint: `Der kleine Zeiger zeigt die Stunde, der große die Minuten. Es ist ${timeWord(h, m)}.` });
}
const UNITS_CONV = {
  3: [["m", "cm", 100], ["kg", "g", 1000], ["€", "ct", 100], ["h", "min", 60], ["cm", "mm", 10]],
  4: [["km", "m", 1000], ["t", "kg", 1000], ["l", "ml", 1000], ["min", "s", 60], ["Tag", "h", 24], ["m", "cm", 100]]
};
const UNAME = { m: "Meter", cm: "Zentimeter", mm: "Millimeter", km: "Kilometer", kg: "Kilogramm", g: "Gramm", t: "Tonnen", l: "Liter", ml: "Milliliter", "€": "Euro", ct: "Cent", h: "Stunden", min: "Minuten", s: "Sekunden", Tag: "Tage" };
const unitSay = s => s.replace(/(\d+) (km|kg|cm|mm|ml|min|ct|Tag|m|g|t|l|h|s|€)(?=\s|$)/g, (m, n, u) => `${n} ${UNAME[u]}`).replace(/ = \? (\S+)$/, (m, u) => ` sind wie viele ${UNAME[u] || u}?`);
function convTask(cls) {
  const [big, small, f] = pick(UNITS_CONV[cls]), k = R(0, 2), x = R(1, 9);
  if (k === 0) return N(`${x} ${big} = ? ${small}`, x * f, { cls: "calc", hint: `1 ${big} = ${f} ${small}`, say: unitSay(`${x} ${big} = ? ${small}`) });
  if (k === 1) { const yy = f === 1000 ? R(1, 9) * 100 : f === 100 ? R(1, 9) * 10 : f === 60 ? pick([15, 30, 45]) : f === 24 ? pick([6, 12]) : R(1, 9); return N(`${x} ${big} ${yy} ${small} = ? ${small}`, x * f + yy, { cls: "calc", hint: `1 ${big} = ${f} ${small}`, say: unitSay(`${x} ${big} ${yy} ${small} = ? ${small}`) }); }
  return N(`${x * f} ${small} = ? ${big}`, x, { cls: "calc", hint: `${f} ${small} = 1 ${big}`, say: unitSay(`${x * f} ${small} = ? ${big}`) });
}
function divRestTask() {
  const d = R(2, 9), q = R(1, 9), r = R(1, d - 1), x = d * q + r, s = `${q} R ${r}`;
  return C(`${x} : ${d} = ?`, s, [`${q + 1} R ${r}`, `${q} R ${r + 1 === d ? r - 1 : r + 1}`, `${q - 1} R ${r + d}`].filter(w => w !== s), { cls: "calc", ot: "word", say: `${x} geteilt durch ${d}`, key: `${x}:${d}R`, hint: `${d} · ${q} = ${d * q}, Rest ${r}` });
}
function pvsTask() {
  const k = R(0, 4), a = R(2, 12), b = R(2, 9), c = R(2, 9);
  if (k === 0) return N(`${a} + ${b} · ${c} = ?`, a + b * c, { cls: "calc", hint: "Punkt vor Strich: erst mal, dann plus." });
  if (k === 1) { const s = R(1, b * c); return N(`${b} · ${c} − ${s} = ?`, b * c - s, { cls: "calc", hint: "Punkt vor Strich: erst mal, dann minus." }); }
  if (k === 2) return N(`(${a} + ${b}) · ${c} = ?`, (a + b) * c, { cls: "calc", hint: "Klammern zuerst!" });
  if (k === 3) return N(`${a * 3 + 20} − ${b * c} : ${c} = ?`, a * 3 + 20 - b, { cls: "calc", hint: "Punkt vor Strich: erst geteilt, dann minus." });
  return N(`${c} · (${a + b} − ${b}) = ?`, c * a, { cls: "calc", hint: "Klammern zuerst!" });
}
const SUP = { 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶" };
function potTask() {
  const k = R(0, 3);
  if (k === 0) { const b = R(2, 12); return N(`${b}² = ?`, b * b, { cls: "calc", say: `${b} hoch 2`, key: `${b}^2`, hint: `${b}² = ${b} · ${b}` }); }
  if (k === 1) { const b = R(2, 5); return N(`${b}³ = ?`, b ** 3, { cls: "calc", say: `${b} hoch 3`, key: `${b}^3`, hint: `${b}³ = ${b} · ${b} · ${b}` }); }
  if (k === 2) { const e = R(2, 6); return N(`10${SUP[e]} = ?`, 10 ** e, { cls: "calc", say: `10 hoch ${e}`, hint: `10${SUP[e]} ist eine 1 mit ${e} Nullen.` }); }
  const b = R(2, 12); return N(`? · ? = ${b * b}  (beide Zahlen gleich)`, b, { cls: "calc", say: `Welche Zahl mal sich selbst ergibt ${b * b}?` });
}
function negTask() {
  const a = R(-10, 10), b = R(-10, 10), op = pick(["+", "−"]);
  const bs = b < 0 ? `(${fmtN(b)})` : fmtN(b);
  return N(`${fmtN(a)} ${op} ${bs} = ?`, op === "+" ? a + b : a - b, { cls: "calc", neg: true, say: `Wie viel ist ${a} ${OPW[op]} ${b}?`, hint: "Minus und Minus wird Plus: 3 − (−2) = 3 + 2" });
}
function fracStr(n, d) { const g = gcd(n, d); return d / g === 1 ? String(n / g) : frs(n / g, d / g); }
function fracWrong(n, d, extra) {
  const ok = n / d, s = new Set();
  for (const [a, b] of extra) if (b > 0 && a > 0 && b / gcd(a, b) > 1 && Math.abs(a / b - ok) > 1e-9) s.add(fracStr(a, b));
  for (let k = 0; s.size < 3 && k < 40; k++) { const a = Math.max(1, n + R(-2, 3)), b = Math.max(2, d + R(-2, 3)); if (b / gcd(a, b) > 1 && Math.abs(a / b - ok) > 1e-9) s.add(fracStr(a, b)); }
  return [...s].slice(0, 3);
}
function bruch5Task() {
  const k = R(0, 2);
  if (k === 0) { const d = pick([2, 3, 4, 5, 6, 8]), n = R(1, d - 1); return C("Welcher Bruch ist gefärbt?", frs(n, d), [frs(d - n, d), frs(n, d + 1), frs(n + 1 <= d ? n + 1 : n - 1, d)].filter(x => x !== frs(n, d)), { vis: V.frac(n, d), ot: "big", hint: `${n} von ${d} Teilen sind gefärbt.` }); }
  if (k === 1) { const d = pick([2, 3, 4, 5, 10]), m = R(2, 10), n = R(1, d - 1); return N(`${frs(n, d)} von ${d * m} = ?`, n * m, { cls: "calc", hint: `${d * m} : ${d} = ${m}, dann · ${n}` }); }
  const d1 = R(2, 8); let d2 = R(2, 8); if (d1 === d2) d2 = d1 + 1;
  return C("Was ist mehr?", frs(1, Math.min(d1, d2)), [frs(1, Math.max(d1, d2))], { ot: "big", max: 2, hint: "Je mehr Teile, desto kleiner ist jedes Stück." });
}
function bruch6Task(kind) {
  if (kind === "kurz") {
    if (Math.random() < 0.6) { const d = R(2, 9), n = R(1, d - 1); if (gcd(n, d) !== 1) return null; const k = R(2, 6); return C(`Kürze so weit wie möglich: ${frs(n * k, d * k)}`, frs(n, d), fracWrong(n, d, [[n * k, d], [n, d * k], [n + 1, d]]), { ot: "big", hint: `Teile Zähler und Nenner durch ${k}.` }); }
    const d = R(2, 9), n = R(1, d - 1), k = R(2, 5);
    if (gcd(n, d) > 1) return null;
    return C(`Erweitere ${frs(n, d)} mit ${k}`, frs(n * k, d * k), [frs(n * k, d), frs(n, d * k), frs(n + k, d + k)].filter(x => x !== frs(n * k, d * k)), { ot: "big", hint: `Zähler und Nenner mal ${k}.` });
  }
  if (kind === "add") {
    const same = Math.random() < 0.45, b = R(2, 9), d = same ? b : R(2, 9), a = R(1, b - 1), c = R(1, d - 1); if (gcd(a, b) > 1 || gcd(c, d) > 1) return null; const sub = Math.random() < 0.4 && a / b > c / d;
    const n = sub ? a * d - c * b : a * d + c * b, dd = b * d;
    return C(`${frs(a, b)} ${sub ? "−" : "+"} ${frs(c, d)} = ?`, fracStr(n, dd), fracWrong(n, dd, [[sub ? a - c : a + c, b + d], [sub ? Math.abs(a - c) : a + c, Math.max(b, d)], [n + 1, dd]]), { ot: "big", hint: b === d ? "Gleicher Nenner: nur die Zähler rechnen." : `Erst auf den gleichen Nenner bringen (${lcm(b, d)}), dann die Zähler rechnen. Am Ende kürzen.` });
  }
  const b = R(2, 9), d = R(2, 9), a = R(1, b - 1), c = R(1, d - 1), div = Math.random() < 0.4;
  if (gcd(a, b) > 1 || gcd(c, d) > 1) return null;
  const n = div ? a * d : a * c, dd = div ? b * c : b * d;
  return C(`${frs(a, b)} ${div ? ":" : "·"} ${frs(c, d)} = ?`, fracStr(n, dd), fracWrong(n, dd, [[a * c, b * d], [a * d, b * c], [a + c, b + d]]), { ot: "big", hint: div ? "Geteilt durch einen Bruch = mal den Kehrwert." : "Zähler mal Zähler, Nenner mal Nenner – dann kürzen." });
}
function dezTask() {
  const k = R(0, 3);
  const a = R(11, 99), b = R(11, 99), p = pick([1, 2]);
  const A = a / 10 ** p, B = b / 10 ** (p === 2 ? R(1, 2) : 1);
  if (k === 0) return N(`${fmtN(A)} + ${fmtN(B)} = ?`, Math.round((A + B) * 100) / 100, { cls: "calc", dec: true, hint: "Komma unter Komma!" });
  if (k === 1) { const x = Math.max(A, B), y = Math.min(A, B); return N(`${fmtN(x)} − ${fmtN(y)} = ?`, Math.round((x - y) * 100) / 100, { cls: "calc", dec: true, hint: "Komma unter Komma!" }); }
  if (k === 2) { const f = pick([10, 100]); return N(`${fmtN(A)} · ${f} = ?`, Math.round(A * f * 100) / 100, { cls: "calc", dec: true, hint: `Mal ${f}: Komma um ${f === 10 ? 1 : 2} Stelle(n) nach rechts.` }); }
  const m = R(2, 5); return N(`${fmtN(a / 10)} · ${m} = ?`, Math.round((a / 10) * m * 100) / 100, { cls: "calc", dec: true });
}
function prozTask() {
  const p = pick([10, 20, 25, 50, 75, 5, 1]), base = pick([100, 200, 300, 400, 40, 60, 80, 120, 500, 1000, 20]);
  const v = (p * base) / 100;
  if (!Number.isInteger(v)) return null;
  if (Math.random() < 0.6) return N(`Wie viel sind ${p} % von ${base}?`, v, { hint: p === 50 ? "50 % ist die Hälfte." : p === 25 ? "25 % ist ein Viertel." : p === 10 ? "10 % = durch 10 teilen." : `1 % = ${base} : 100` });
  return N(`Wie viel Prozent sind ${v} von ${base}?`, p, { hint: `${v} : ${base} · 100` });
}
const DREI = [["Hefte", "Heft", "€", 2, 4], ["Brötchen", "Brötchen", "€", 1, 3], ["Kugeln Eis", "Kugel Eis", "€", 2, 3], ["Äpfel", "Apfel", "Cent", 40, 60], ["Stifte", "Stift", "€", 3, 5], ["Bonbons", "Bonbon", "Cent", 5, 10]];
function dreiTask() {
  const [w, w1, u, p0, p1] = pick(DREI), p = R(p0, p1), a = R(2, 6); let b = R(2, 10); if (b === a) b++;
  return N(`${a} ${w} kosten ${a * p} ${u}. Wie viel kosten ${b} ${w}?`, b * p, { hint: `Erst 1 ${w1}: ${a * p} : ${a} = ${p} ${u}. Dann · ${b}.` });
}

/* ---------- Was ist das? (sprechen) ---------- */
const CATQ = { farb: "Wie heißt die Farbe oder Form?", gefuehl: "Wie fühlt sich das Gesicht?", zeichen: "Was bedeutet das Zeichen?", laender: "Welches Land hat diese Flagge?" };
function speakTask(it) {
  const pool = WL[it.cat].filter(x => x.w !== it.w);
  const q = CATQ[it.cat] || "Was ist das?";
  return { type: "speak", q: q + " Sag es laut!", say: q, vis: V.emo(it.e), a: [it.w, ...it.alt], word: it.w, key: "W:" + it.w,
    fb: C(q, it.w, sample(pool, 3).map(x => x.w), { vis: V.emo(it.e), ot: "word" }) };
}
function speakTasks(cats, n = 10) { const pool = cats.flatMap(c => WL[c]); return sample(pool, n).map(speakTask); }
function pluralWrong(w, pl) {
  const um = w.length <= 5 ? w.replace(/[aou](?!.*[aou])/, c => ({ a: "ä", o: "ö", u: "ü" })[c]) : w;
  const c = w.endsWith("e") ? [w + "n", w + "s", w + "r", w, um + "n"] : [w + "e", w + "en", w + "s", w + "er", um + "e", um + "er", w];
  return sample([...new Set(c)].filter(x => x !== pl), 3);
}
function pluralTask(it, speak) {
  const fb = C(`Ein${it.art === "die" ? "e" : ""} ${it.w} – viele …?`, it.pl, pluralWrong(it.w, it.pl), { vis: V.emo(it.e + " → " + it.e + it.e + it.e), ot: "word", say: `ein${it.art === "die" ? "e" : ""} ${it.w}, viele …?`, key: "P:" + it.w });
  if (!speak) return fb;
  return { type: "speak", q: `Ein${it.art === "die" ? "e" : ""} ${it.w} – viele …? Sag es laut!`, say: `ein${it.art === "die" ? "e" : ""} ${it.w}, viele …?`, vis: fb.vis, a: [it.pl], word: it.pl, key: "P:" + it.w, fb };
}

/* ---------- Deutsch ---------- */
const SIL = list(SILB).map(x => { const [e, w] = x.split("|"); return { e, w }; });
const RM = list(REIME).map(x => x.split("|").map(y => { const i = y.indexOf(" "); return { e: y.slice(0, i), w: y.slice(i + 1) }; }));
function qLines(s) { return s.split("\n").map(l => { const [q, a, w, h] = l.split("|"); return { q, a, w: w.split(";"), h }; }); }
function qTasks(s, n = 10, o = {}) { return sample(qLines(s), n).map(x => C(x.q, x.a, x.w, { ot: "word", hint: x.h, ...o })); }
const pairs = s => list(s).map(x => x.split("|"));
const KJ = KONJ.split(";").map(l => { const [v, f] = l.split(":"); return { v, f: f.split(",") }; });
const VTL = VT.split(";").map(l => { const [inf, pr, pt, pf, obj] = l.split("|"); const [aux, part] = pf.split(" "); return { inf, pr, pt, aux, part, obj: obj || "" }; });
function tenseForms(v) { // Satzrest (z. B. „ein Buch“) steht zwischen Hilfsverb und Partizip/Infinitiv
  const o = v.obj ? " " + v.obj : "";
  return {
    "Präsens": `${v.pr}${o}`, "Präteritum": `${v.pt}${o}`, "Perfekt": `${v.aux}${o} ${v.part}`, "Futur I": `wird${o} ${v.inf}`,
    "Plusquamperfekt": `${v.aux === "ist" ? "war" : "hatte"}${o} ${v.part}`, "Futur II": `wird${o} ${v.part} ${v.aux === "ist" ? "sein" : "haben"}`
  };
}
function tenseTask(all) {
  const v = pick(VTL), f = tenseForms(v), names = all ? Object.keys(f) : ["Präsens", "Präteritum", "Perfekt", "Futur I"], t = pick(names), s = pick(SUBJ);
  const sent = `${s} ${f[t]}.`;
  return C(`In welcher Zeitform steht der Satz?`, t, sample(names.filter(x => x !== t), 3), { vis: V.word(sent), ot: "word", say: `${sent} In welcher Zeitform steht der Satz?`, hint: `${t}: ${s} ${f[t]}.` });
}
function praetTask() {
  const v = pick(VTL), stem = v.inf.replace(/en$|n$/, "");
  return C(`Präteritum von „${v.inf}“: er …`, v.pt, [stem + "te", v.pr, v.part].filter(x => x !== v.pt), { ot: "word", say: `Wie heißt ${v.inf} in der Vergangenheit? Er …`, hint: `er ${v.pr} → er ${v.pt} → er ${v.aux} ${v.part}`, key: "PT:" + v.inf });
}
const SG = SATZGL.split(";").map(l => l.split("|").map(p => ({ r: p[0], t: p.slice(2) })));
const ROLE = { S: ["das Subjekt", "Wer oder was?"], P: ["das Prädikat", "Was tut jemand? (das Verb)"], A: ["das Akkusativobjekt", "Wen oder was?"], D: ["das Dativobjekt", "Wem?"] };
function satzglTask(roles) {
  const s = pick(SG.filter(x => x.some(p => roles.includes(p.r)))), part = pick(s.filter(p => roles.includes(p.r)));
  const sent = s.map(p => p.t).join(" ") + ".";
  return C(`Was ist ${ROLE[part.r][0]}?`, part.t, s.filter(p => p !== part).map(p => p.t), { vis: V.word(sent.charAt(0).toUpperCase() + sent.slice(1)), ot: "word", say: `${sent} Was ist ${ROLE[part.r][0]}?`, hint: `Frage: ${ROLE[part.r][1]} → ${part.t}` });
}
function steigTask() {
  const [g, k, s] = pick(STEIG.split(";")).split("|"), slot = R(0, 1);
  if (slot === 0) return C(`${g} – ? – ${s}`, k, [g + "er", s.replace("am ", ""), "mehr " + g].filter(x => x !== k), { ot: "word", say: `${g}, … , ${s}`, hint: `${g} – ${k} – ${s}` });
  return C(`${g} – ${k} – ?`, s, [`am ${g}sten`, `am ${k}`, `${k}ste`].filter(x => x !== s), { ot: "word", say: `${g}, ${k}, …`, hint: `${g} – ${k} – ${s}` });
}
function luckeTask() {
  const it = pick(SHORTW), vi = [...it.w].map((c, i) => ("aeiou".includes(c) ? i : -1)).filter(i => i >= 0);
  if (!vi.length) return null;
  const i = pick(vi), c = it.w[i];
  return C("Welcher Buchstabe fehlt?", c, sample([..."aeiou"].filter(x => x !== c), 3), { vis: V.emo(it.e) + V.word(it.w.slice(0, i) + '<span class="qbox">?</span>' + it.w.slice(i + 1)), ot: "big", say: `${it.w}. Welcher Buchstabe fehlt?`, hint: `Richtig: ${it.w}`, key: "LU:" + it.w });
}

/* ======================= LEKTIONEN ======================= */
const AREAS = [
  { id: "buch", name: "Buchstaben", icon: "🔤", c: "coral" },
  { id: "zahl", name: "Zahlen", icon: "🔢", c: "sun" },
  { id: "rech", name: "Rechnen", icon: "➕", c: "mint" },
  { id: "schr", name: "Schreiben", icon: "✏️", c: "lav" },
  { id: "wort", name: "Was ist das?", icon: "🗣️", c: "sky" },
  { id: "deut", name: "Deutsch", icon: "📖", c: "org" }
];
const UNITS = [];
const U = (id, area, cls, icon, name, gen, info) => UNITS.push({ id, area, cls, icon, name, gen, info });
const T10 = f => () => uniqTasks(10, f);

/* --- Buchstaben --- */
LETTER_GROUPS.forEach((g, i) => U("b_g" + i, "buch", 1, ["🍎", "🐁", "🚀", "🐟", "🦒", "🤡"][i] || "🔤", "Buchstaben " + [...g].join(" "), () => letterTasks(g, ["hear", "anl", "pic", "case", "up"])));
U("b_anl", "buch", 1, "🐒", "Anlaute: Womit fängt es an?", () => letterTasks(Object.keys(ANLW).join(""), ["anl", "pic"]));
U("b_gk", "buch", 1, "🔠", "Groß und klein", () => letterTasks(ABC, ["case", "up"]));
U("b_abc", "buch", 1, "🔤", "Das ABC", T10(abcTask));
U("b_laut", "buch", 2, "👂", "Laute: au, ei, sch …", T10(lautTask));
U("b_uml", "buch", 2, "🐻", "Ä, Ö, Ü und ß", T10(umlTask));
U("b_abc2", "buch", 2, "📚", "Wörter nach dem ABC", T10(abcWordTask));

/* --- Zahlen --- */
U("z_10", "zahl", 1, "🖐️", "Zahlen bis 10", T10(() => pick([() => countTask(10), () => hearNumTask(0, 10), () => biggerTask(10)])()));
U("z_20", "zahl", 1, "🔟", "Zahlen bis 20", T10(() => pick([() => countTask(20), () => hearNumTask(0, 20), () => biggerTask(20)])()));
U("z_nach", "zahl", 1, "🏘️", "Nachbarzahlen", T10(() => neighborTask(20)));
U("z_vgl", "zahl", 1, "🐊", "Größer, kleiner, gleich", T10(() => cmpTask(0, 20)));
U("z_reihe", "zahl", 1, "🔁", "Zahlenreihen", T10(() => seqTask(20, [1, 2])));
U("z_100", "zahl", 2, "💯", "Zahlen bis 100", T10(() => { const n = R(11, 99); return Math.random() < 0.5 ? N("Welche Zahl ist das?", n, { vis: V.tens(n), say: "Welche Zahl ist das? Zähle die Zehner und die Einer.", key: "Z:" + n }) : N("Tippe die Zahl, die du hörst.", n, { say: String(n), autoSay: true, vis: V.big("🔊"), key: "Z:" + n }); }));
U("z_ze", "zahl", 2, "🧱", "Zehner und Einer", T10(() => { const n = R(11, 99), k = R(0, 2); if (k === 0) return N(`Wie viele Zehner hat ${n}?`, Math.floor(n / 10), { vis: V.big(n) }); if (k === 1) return N(`Wie viele Einer hat ${n}?`, n % 10, { vis: V.big(n) }); return N(`${Math.floor(n / 10)} Zehner und ${n % 10} Einer = ?`, n, { vis: V.tens(n) }); }));
U("z_gu", "zahl", 2, "⚖️", "Gerade und ungerade", T10(() => { const n = R(1, 100); return C(`Ist ${n} gerade oder ungerade?`, n % 2 ? "ungerade" : "gerade", [n % 2 ? "gerade" : "ungerade"], { vis: V.big(n), ot: "word", max: 2, hint: "Gerade Zahlen enden auf 0, 2, 4, 6 oder 8." }); }));
U("z_reihe2", "zahl", 2, "🔁", "Zahlenfolgen bis 100", T10(() => seqTask(100, [2, 3, 4, 5, 10])));
U("z_1000", "zahl", 3, "🏗️", "Zahlen bis 1000", T10(() => { const n = R(101, 999), k = R(0, 3); if (k === 0) return N(`Wie viele Hunderter hat ${n}?`, Math.floor(n / 100), { vis: V.big(n) }); if (k === 1) return N(`${Math.floor(n / 100)} H ${Math.floor((n % 100) / 10)} Z ${n % 10} E = ?`, n, { vis: V.hze(n), hint: "H = Hunderter, Z = Zehner, E = Einer", say: `${Math.floor(n / 100)} Hunderter, ${Math.floor((n % 100) / 10)} Zehner und ${n % 10} Einer. Welche Zahl ist das?` }); if (k === 2) return N("Tippe die Zahl, die du hörst.", n, { say: String(n), autoSay: true, vis: V.big("🔊") }); return cmpTask(100, 999); }));
U("z_nz", "zahl", 3, "🏘️", "Nachbarzehner und -hunderter", T10(() => { const n = R(101, 989); if (n % 10 === 0) return null; const k = R(0, 3); const [p, w] = k < 2 ? [10, "Zehner"] : [100, "Hunderter"]; const lo = Math.floor(n / p) * p; return k % 2 === 0 ? N(`Welcher ${w} kommt vor ${n}?`, lo, { vis: V.big(`<span class="qbox">?</span> ← ${n}`) }) : N(`Welcher ${w} kommt nach ${n}?`, lo + p, { vis: V.big(`${n} → <span class="qbox">?</span>`) }); }));
U("z_rund3", "zahl", 3, "🎯", "Runden auf Zehner", T10(() => { const n = R(11, 999); return N(`Runde ${n} auf Zehner.`, roundTo(n, 10), { hint: "Bei 0–4 abrunden, bei 5–9 aufrunden." }); }));
U("z_mio", "zahl", 4, "🌌", "Zahlen bis 1 Million", T10(() => { const n = R(1000, 999999); if (Math.random() < 0.5) { const [p, w] = pick(PLACE.filter(x => x[0] <= n)); return N(`Welche Ziffer steht an der ${w}stelle?`, Math.floor(n / p) % 10, { vis: V.big(fmtN(n)), say: `Welche Ziffer steht an der ${w}stelle von ${n}?` }); } const d = String(n).split(""); const wrong = nearNums(n, () => { const x = d.slice(); const i = R(0, x.length - 1), j = R(0, x.length - 1); [x[i], x[j]] = [x[j], x[i]]; return Number(x.join("")); }, 1000); return C("Welche Zahl hörst du?", fmtN(n), wrong.map(fmtN), { say: String(n), autoSay: true, ot: "word" }); }));
U("z_stell", "zahl", 4, "🧮", "Stellenwerte", T10(() => { const parts = PLACE.slice(2).filter(() => Math.random() < 0.7); if (!parts.length) return null; let n = 0; const txt = parts.reverse().map(([p, w]) => { const d = R(1, 9); n += d * p; return `${d} ${w}`; }); return N(txt.join(" + ") + " = ?", n); }));
U("z_rund4", "zahl", 4, "🎯", "Runden", T10(() => { const n = R(1000, 99999), [p, w] = pick([[100, "Hunderter"], [1000, "Tausender"], [10000, "Zehntausender"]]); return N(`Runde ${fmtN(n)} auf ${w}.`, roundTo(n, p), { hint: "Schau auf die Ziffer rechts daneben: 0–4 abrunden, 5–9 aufrunden.", say: `Runde ${n} auf ${w}.` }); }));
U("z_neg", "zahl", 5, "🌡️", "Negative Zahlen", T10(() => { const k = R(0, 2); if (k === 0) return cmpTask(-10, 10); if (k === 1) { const t = R(-8, 5), d = R(2, 9), up = Math.random() < 0.5; return N(`Es ist ${fmtN(t)} °C. Es wird ${d} Grad ${up ? "wärmer" : "kälter"}. Wie warm ist es jetzt?`, up ? t + d : t - d, { vis: V.thermo(t), neg: true, say: `Es ist ${t} Grad. Es wird ${d} Grad ${up ? "wärmer" : "kälter"}. Wie warm ist es jetzt?` }); } const ns = sample([...Array(21)].map((_, i) => i - 10), 4); return C("Welche Zahl ist am kleinsten?", fmtN(Math.min(...ns)), ns.filter(x => x !== Math.min(...ns)).map(fmtN), { ot: "big" }); }));
U("z_rom", "zahl", 5, "🏛️", "Römische Zahlen", T10(() => { const n = R(1, 100 + R(0, 1) * 1900); return Math.random() < 0.5 ? C(`Welche Zahl ist ${roman(n)}?`, n, nearNums(n, () => n + R(-11, 11), 1), { ot: "big", say: `Welche Zahl ist ${[...roman(n)].join(" ")}?`, hint: "I=1, V=5, X=10, L=50, C=100, D=500, M=1000", key: "RM:" + n }) : C(`Wie schreibt man ${n} römisch?`, roman(n), nearNums(n, () => n + pick([-10, -5, -1, 1, 4, 5, 9, 10]), 1).map(roman), { ot: "word", hint: "I=1, V=5, X=10, L=50, C=100, D=500, M=1000", key: "RM:" + n }); }));
U("z_teil", "zahl", 5, "🔍", "Teiler und Vielfache", T10(() => { const k = R(0, 2); if (k === 0) { const d = R(2, 9), n = Math.random() < 0.5 ? d * R(3, 12) : R(20, 99); return C(`Ist ${n} durch ${d} teilbar?`, n % d ? "nein" : "ja", [n % d ? "ja" : "nein"], { ot: "word", max: 2, hint: n % d ? `${n} : ${d} geht nicht auf.` : `${n} : ${d} = ${n / d}` }); } if (k === 1) { const n = pick([12, 18, 20, 24, 30, 36, 40, 42, 48]), divs = [...Array(n)].map((_, i) => i + 1).filter(i => n % i === 0 && i > 1 && i < n), nd = [...Array(n)].map((_, i) => i + 1).filter(i => n % i && i > 1); return C(`Welche Zahl ist ein Teiler von ${n}?`, pick(divs), sample(nd, 3), { ot: "big" }); } const m = R(3, 9), v = m * R(3, 12); return C(`Welche Zahl ist ein Vielfaches von ${m}?`, v, nearNums(v, () => v + R(-6, 6)).filter(x => x % m), { ot: "big", hint: `Vielfache von ${m}: ${m}, ${m * 2}, ${m * 3}, …` }); }));
U("z_dez", "zahl", 6, "🔸", "Dezimalzahlen", T10(() => { const k = R(0, 2); if (k === 0) return cmpTask(1, 99, R(1, 2)); if (k === 1) { const n = R(101, 999) / 100; return N(`Runde ${fmtN(n)} auf Zehntel.`, Math.round(n * 10) / 10, { dec: true, hint: "Schau auf die Hundertstel-Ziffer." }); } const ns = [R(1, 9) / 10, R(10, 99) / 100, R(1, 9) / 10 + R(1, 9) / 100, R(101, 199) / 1000 * 10].map(x => Math.round(x * 1000) / 1000); const mx = Math.max(...ns); return C("Welche Zahl ist am größten?", fmtN(mx), ns.filter(x => x !== mx).map(fmtN), { ot: "big", hint: "Vergleiche Stelle für Stelle: erst Einer, dann Zehntel, dann Hundertstel." }); }));
U("z_prim", "zahl", 6, "💎", "Primzahlen", T10(() => { if (Math.random() < 0.5) { const n = R(2, 60); return C(`Ist ${n} eine Primzahl?`, isPrime(n) ? "ja" : "nein", [isPrime(n) ? "nein" : "ja"], { ot: "word", max: 2, hint: "Primzahlen kann man nur durch 1 und sich selbst teilen: 2, 3, 5, 7, 11, 13 …" }); } const p = pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]); return C("Welche Zahl ist eine Primzahl?", p, sample([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 21, 22, 25, 27, 33, 35, 39, 49, 51], 3), { ot: "big" }); }));
U("z_ggt", "zahl", 6, "🤝", "ggT und kgV", T10(() => { const g = R(2, 6), a = g * R(2, 7), b = g * R(2, 7); if (a === b) return null; return Math.random() < 0.5 ? N(`ggT von ${a} und ${b} = ?`, gcd(a, b), { hint: "Größter gemeinsamer Teiler: die größte Zahl, durch die beide teilbar sind." }) : N(`kgV von ${a / g} und ${b / g} = ?`, lcm(a / g, b / g), { hint: "Kleinstes gemeinsames Vielfaches: die kleinste Zahl in beiden Einmaleins-Reihen." }); }));

/* --- Rechnen --- */
U("r_p10", "rech", 1, "🍎", "Plus bis 10", T10(i => { const a = R(0, 8), b = R(1, 10 - a); return calc(a, "+", b, i < 5 ? { vis: V.pics(a, "+", b, pick(EMO)) } : {}); }));
U("r_m10", "rech", 1, "🎈", "Minus bis 10", T10(i => { const a = R(2, 10), b = R(1, a); return calc(a, "−", b, i < 5 ? { vis: V.pics(a, "−", b, pick(EMO)) } : {}); }));
U("r_zer", "rech", 1, "🏠", "Zahlenhaus (zerlegen)", T10(() => { const t = R(4, 10), x = R(0, t); return N(`${t} = ${x} + ?`, t - x, { vis: V.house(t, x), say: `Zerlege ${t}. ${x} und wie viel sind zusammen ${t}?`, key: `ZH${t}=${x}+` }); }));
U("r_p20", "rech", 1, "➕", "Plus bis 20", T10(i => plusTask(20, i % 2 ? null : undefined)));
U("r_m20", "rech", 1, "➖", "Minus bis 20", T10(() => { const a = R(11, 20), b = R(1, a - 1); return calc(a, "−", b); }));
U("r_dop", "rech", 1, "👯", "Verdoppeln und Halbieren", T10(() => { const x = R(1, 10); return Math.random() < 0.5 ? N(`Verdopple ${x}.`, 2 * x, { vis: V.big(`${x} + ${x} = <span class="qbox">?</span>`), key: `D${x}` }) : N(`Die Hälfte von ${2 * x}?`, x, { vis: V.big(`${2 * x} = <span class="qbox">?</span> + <span class="qbox">?</span>`), key: `H${2 * x}` }); }));
U("r_p100", "rech", 2, "➕", "Plus bis 100", T10(i => plusTask(100, i < 2 ? "TT" : i < 6 ? false : true)));
U("r_m100", "rech", 2, "➖", "Minus bis 100", T10(i => minusTask(100, i < 2 ? "TT" : i < 6 ? false : true)));
U("r_1x1e", "rech", 2, "✖️", "Einmaleins: 2er, 5er, 10er", T10(() => { const r = pick([2, 5, 10]), b = R(1, 10); return Math.random() < 0.5 ? calc(b, "·", r) : calc(r, "·", b); }));
U("r_1x1", "rech", 2, "🔢", "Einmaleins: alle Reihen", T10(() => calc(R(2, 10), "·", R(1, 10))));
U("r_div", "rech", 2, "🍰", "Geteilt (1 : 1)", T10(() => { const b = R(2, 10), q = R(1, 10); return calc(b * q, ":", b); }));
U("r_uhr", "rech", 2, "🕐", "Uhrzeit: volle und halbe Stunden", T10(() => clockTask([0, 30], true)));
U("r_pm1000", "rech", 3, "🏗️", "Plus und Minus bis 1000", T10(i => { const k = i % 3; if (k === 0) { const a = R(1, 8) * 100, b = R(1, (1000 - a) / 100) * 100; return Math.random() < 0.5 ? calc(a, "+", b) : calc(a + b, "−", b); } const a = R(100, 899), b = R(10, Math.min(999 - a, 300)); return Math.random() < 0.5 ? calc(a, "+", b) : calc(a + b, "−", k === 1 ? b - (b % 10) || 10 : b); }));
U("r_1x1m", "rech", 3, "🎲", "Einmaleins gemischt", T10(() => { const a = R(2, 10), b = R(2, 10), k = R(0, 2); if (k === 0) return calc(a, "·", b); if (k === 1) return calc(a * b, ":", a); return N(`? · ${b} = ${a * b}`, a, { cls: "calc", key: `?·${b}=${a * b}`, say: `Wie viel mal ${b} ist ${a * b}?` }); }));
U("r_divr", "rech", 3, "🧩", "Teilen mit Rest", T10(divRestTask));
U("r_zehn", "rech", 3, "🔟", "Mal und geteilt mit Zehnerzahlen", T10(() => { const a = R(2, 9), b = R(2, 9), k = R(0, 2); if (k === 0) return calc(a * 10, "·", b); if (k === 1) return calc(a * b * 100, ":", b); return calc(a * b * 10, ":", a); }));
U("r_uhr3", "rech", 3, "⏰", "Uhrzeit: Viertel und Minuten", T10(i => i % 2 ? clockTask([15, 30, 45], true) : clockTask([5, 10, 20, 25, 35, 40, 50, 55], false)));
U("r_groe", "rech", 3, "📏", "Größen umrechnen", T10(() => convTask(3)));
U("r_schr", "rech", 4, "🧾", "Schriftlich plus und minus", T10(() => { const a = R(1000, 8999), b = R(100, 999 * R(1, 3)); return Math.random() < 0.5 ? calc(a, "+", b, { vis: V.column(a, "+", b), cls: "" }) : calc(Math.max(a, b), "−", Math.min(a, b), { vis: V.column(Math.max(a, b), "−", Math.min(a, b)), cls: "" }); }));
U("r_mult", "rech", 4, "✖️", "Schriftlich malnehmen", T10(() => Math.random() < 0.6 ? calc(R(102, 989), "·", R(2, 9)) : calc(R(12, 99), "·", R(11, 49))));
U("r_div4", "rech", 4, "➗", "Schriftlich teilen", T10(() => { const d = R(2, 9), q = R(100, 999); return calc(d * q, ":", d); }));
U("r_ueb", "rech", 4, "🎯", "Überschlagen", T10(() => { const a = R(110, 890), b = R(110, 890), s = roundTo(a, 100) + roundTo(b, 100); return C(`Überschlage: ${a} + ${b} ≈ ?`, s, [s - 100, s + 100, s + 200], { ot: "big", hint: `${a} ≈ ${roundTo(a, 100)}, ${b} ≈ ${roundTo(b, 100)}` }); }));
U("r_groe4", "rech", 4, "⚖️", "Größen: km, t, l, min", T10(() => convTask(4)));
U("r_pvs", "rech", 5, "🧠", "Punkt vor Strich und Klammern", T10(pvsTask));
U("r_pot", "rech", 5, "🚀", "Quadratzahlen und Potenzen", T10(potTask));
U("r_neg", "rech", 5, "🌡️", "Rechnen mit negativen Zahlen", T10(negTask));
U("r_bruch5", "rech", 5, "🍕", "Brüche verstehen", T10(bruch5Task));
U("r_flae", "rech", 5, "📐", "Fläche und Umfang", T10(() => { const a = R(2, 12), b = R(2, 9); return Math.random() < 0.5 ? N("Wie groß ist die Fläche? (in cm²)", a * b, { vis: V.rect(a, b), hint: "Fläche = Länge · Breite", say: `Das Rechteck ist ${a} Zentimeter lang und ${b} Zentimeter breit. Wie groß ist die Fläche in Quadratzentimetern?` }) : N("Wie lang ist der Umfang? (in cm)", 2 * (a + b), { vis: V.rect(a, b), hint: "Umfang = alle Seiten zusammen = 2 · (Länge + Breite)", say: `Das Rechteck ist ${a} Zentimeter lang und ${b} Zentimeter breit. Wie lang ist der Umfang in Zentimetern?` }); }));
U("r_bkurz", "rech", 6, "✂️", "Brüche kürzen und erweitern", T10(() => bruch6Task("kurz")));
U("r_badd", "rech", 6, "🍰", "Brüche plus und minus", T10(() => bruch6Task("add")));
U("r_bmul", "rech", 6, "🥧", "Brüche mal und geteilt", T10(() => bruch6Task("mul")));
U("r_dez", "rech", 6, "🔸", "Rechnen mit Dezimalzahlen", T10(dezTask));
U("r_proz", "rech", 6, "💯", "Prozent", T10(prozTask));
U("r_drei", "rech", 6, "🛒", "Dreisatz", T10(dreiTask));

/* --- Schreiben --- */
U("s_gross", "schr", 1, "🅰️", "Große Buchstaben nachspuren", () => sample([...ABC, "Ä", "Ö", "Ü"], 6).map(ch => ({ type: "trace", g: ch, q: `Fahr das große ${ch} nach.`, say: `Fahr das große ${ch} mit dem Finger nach.`, key: "S:" + ch })));
U("s_klein", "schr", 1, "🔡", "Kleine Buchstaben nachspuren", () => sample([...GL_LOW, "ä", "ö", "ü", "ß"], 6).map(ch => ({ type: "trace", g: ch, q: `Fahr das kleine ${ch} nach.`, say: `Fahr das kleine ${ch} mit dem Finger nach.`, key: "S:" + ch })));
U("s_zahl", "schr", 1, "🔢", "Zahlen nachspuren", () => sample([...GL_DIG], 6).map(ch => ({ type: "trace", g: ch, q: `Fahr die ${ch} nach.`, say: `Fahr die Zahl ${ch} mit dem Finger nach.`, key: "S:" + ch })));
U("s_frei", "schr", 1, "✍️", "Zahlen frei schreiben", () => sample([...GL_DIG], 6).map(ch => ({ type: "write", g: ch, set: GL_DIG, q: `Schreib die Zahl ${ch}.`, say: `Schreib die Zahl ${ch}.`, key: "F:" + ch })));
U("s_freib", "schr", 1, "🖊️", "Große Buchstaben frei schreiben", () => sample([...ABC], 6).map(ch => ({ type: "write", g: ch, set: GL_UP, q: `Schreib ein großes ${ch}.`, say: `Schreib ein großes ${ch}.`, key: "F:" + ch })));
U("s_erg", "schr", 1, "🧮", "Ergebnis mit dem Finger schreiben", () => uniqTasks(6, () => {
  const r = R(0, 9), w = (q, say, key) => ({ type: "write", g: String(r), set: GL_DIG, q, say: say + ". Schreib das Ergebnis.", cls: "calc", key });
  if (r === 9 || Math.random() < 0.6) { const a = R(0, r); return w(`${a} + ${r - a} = ?`, `${a} plus ${r - a}`, `W${a}+${r - a}`); }
  const b = R(1, 9 - r); return w(`${r + b} − ${b} = ?`, `${r + b} minus ${b}`, `W${r + b}−${b}`);
}));
U("s_name", "schr", 1, "📛", "Meinen Namen schreiben", () => { const n = (typeof P === "function" && P() && P().name) || "Name"; const nm = hasGlyphs(n) && n.length <= 8 ? n : "Mama"; return [0, 1, 2].map(() => ({ type: "trace", g: nm, q: `Fahr den Namen „${nm}“ nach.`, say: `Fahr den Namen ${nm} mit dem Finger nach.` })); });
U("s_wort", "schr", 2, "📝", "Wörter nachspuren", () => sample(list(TRACE_WORDS), 5).map(w => ({ type: "trace", g: w, q: `Fahr das Wort „${w}“ nach.`, say: `Fahr das Wort ${w} nach.`, key: "SW:" + w })));
for (let k = 2; k <= 6; k++) U("s_dik" + k, "schr", k, "🎧", k === 2 ? "Diktat: kurze Wörter" : k === 3 ? "Diktat: ie, ck, tz, ß" : k === 4 ? "Diktat: lange Wörter" : k === 5 ? "Diktat: Fremdwörter" : "Diktat: schwierige Wörter", () => sample(list(DIKTAT[k]), 10).map(w => ({ type: "type", a: w, q: "Hör gut zu und schreib das Wort.", say: w, autoSay: true, key: "D:" + w })));

/* --- Was ist das? (Bilder benennen, sprechen) --- */
const WU = [["tiere", 1], ["obst", 1], ["essen", 1], ["fahr", 1], ["haus", 1], ["kleid", 1], ["farb", 1], ["natur", 2], ["gefuehl", 2], ["berufe", 2], ["schule", 2], ["zeichen", 2], ["sport", 3], ["laender", 4], ["welt", 5], ["wiss", 6]];
for (const [cat, cls] of WU) U("w_" + cat, "wort", cls, WL[cat][0].e, WCAT[cat], () => speakTasks([cat]));
U("w_mz", "wort", 2, "🐶", "Einer – viele (Mehrzahl sagen)", () => sample(ALLW.filter(x => x.pl && x.pl !== "-" && x.pl !== x.w && x.art !== "-"), 10).map(it => pluralTask(it, true)));
for (let k = 3; k <= 6; k++) U("w_mix" + k, "wort", k, "🎁", "Bunt gemischt", () => speakTasks(WU.filter(x => x[1] <= k).map(x => x[0])));

/* --- Deutsch --- */
U("d_silb", "deut", 1, "👏", "Silben klatschen", T10(() => { const it = pick(SIL), n = it.w.split("-").length, w = it.w.replace(/-/g, ""); return C(`Wie viele Silben hat „${w}“?`, n, [1, 2, 3, 4, 5].filter(x => x !== n).slice(0, 3), { vis: V.emo(it.e, w), ot: "big", say: `${w}. Klatsch mit! Wie viele Silben hat ${w}?`, hint: `${it.w.replace(/-/g, " – ")} → ${n} Silbe${n > 1 ? "n" : ""}`, key: "SB:" + w }); }));
U("d_lies", "deut", 1, "👀", "Wort lesen – Bild finden", T10(() => { const it = pick(SHORTW); return C("Lies das Wort. Welches Bild passt?", it.e, sample(SHORTW.filter(x => x.w !== it.w), 3).map(x => x.e), { vis: V.word(it.w), ot: "emoji", say: "Lies das Wort. Welches Bild passt?", key: "LS:" + it.w, labels: Object.fromEntries(SHORTW.map(x => [x.e, x.w])) }); }));
U("d_vorlesen", "deut", 1, "🗣️", "Wörter laut vorlesen", () => sample(SHORTW, 10).map(it => ({ type: "speak", q: "Lies das Wort laut vor!", say: "Lies das Wort laut vor!", vis: V.word(it.w), a: [it.w], word: it.w, key: "VL:" + it.w, fb: C("Lies das Wort. Welches Bild passt?", it.e, sample(SHORTW.filter(x => x.w !== it.w), 3).map(x => x.e), { vis: V.word(it.w), ot: "emoji" }) })));
U("d_reim", "deut", 1, "🎵", "Reime finden", T10(() => { const p = pick(RM), [a, b] = shuffle(p); const wrong = sample(RM.filter(x => x !== p), 3).map(x => pick(x)); return C(`Was reimt sich auf „${a.w}“?`, `${b.e} ${b.w}`, wrong.map(x => `${x.e} ${x.w}`), { vis: V.emo(a.e, a.w), ot: "word", say: `Was reimt sich auf ${a.w}?`, hint: `${a.w} – ${b.w}` }); }));
U("d_nomen", "deut", 2, "🏷️", "Nomen finden", T10(() => { const n = pick(list(NOMEN)); return C("Welches Wort ist ein Nomen?", n.toUpperCase(), sample([...list(VERBEN), ...list(ADJEKTIVE)], 3).map(x => x.toUpperCase()), { ot: "word", say: "Welches Wort ist ein Nomen? Tipp: Vor ein Nomen kann man der, die oder das setzen.", hint: `${n} ist ein Nomen – man kann der, die oder das davor setzen.` }); }));
U("d_gross", "deut", 2, "🔠", "Groß oder klein?", T10(() => { const k = R(0, 2), w = pick(list(k === 0 ? NOMEN : k === 1 ? VERBEN : ADJEKTIVE)); const right = w, other = k === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1); return C("Wie schreibt man das Wort richtig?", right, [other], { ot: "word", max: 2, say: `Wie schreibt man ${w} richtig? Groß oder klein?`, hint: k === 0 ? "Nomen schreibt man groß." : "Verben und Adjektive schreibt man klein." }); }));
U("d_mz", "deut", 2, "👯", "Einzahl und Mehrzahl", T10(() => pluralTask(pick(ALLW.filter(x => x.pl && x.pl !== "-" && x.pl !== x.w && x.art !== "-")), false)));
U("d_luecke", "deut", 2, "🕳️", "Welcher Buchstabe fehlt?", T10(luckeTask));
U("d_satz", "deut", 2, "❓", "Punkt, Fragezeichen, Ausrufezeichen", T10(() => { const [s, z] = pick(SATZEND.split(";")).split("|"); return C("Welches Zeichen gehört ans Ende?", z, [".", "?", "!"].filter(x => x !== z), { vis: V.word(s + ' <span class="qbox">?</span>'), ot: "big", say: `${s}. Welches Zeichen gehört ans Ende? Punkt, Fragezeichen oder Ausrufezeichen?`, hint: z === "?" ? "Eine Frage endet mit ?" : z === "!" ? "Ein Ausruf oder Befehl endet mit !" : "Ein Erzählsatz endet mit einem Punkt." }); }));
U("d_wart", "deut", 3, "🏷️", "Nomen, Verb oder Adjektiv?", T10(() => { const k = R(0, 2), w = pick(list([NOMEN, VERBEN, ADJEKTIVE][k])), a = ["Nomen", "Verb", "Adjektiv"][k]; return C(`Was für ein Wort ist „${w}“?`, a, ["Nomen", "Verb", "Adjektiv"].filter(x => x !== a), { ot: "word", hint: ["Nomen: der, die, das davor.", "Verb: Das kann man tun.", "Adjektiv: Wie ist etwas?"][k] }); }));
U("d_art", "deut", 3, "🎩", "der, die oder das?", T10(() => { const it = pick(ALLW.filter(x => ["der", "die", "das"].includes(x.art) && !PLURAL_ONLY.has(x.w) && /^[A-ZÄÖÜ]/.test(x.w))); return C(`… ${it.w}`, it.art, ["der", "die", "das"].filter(x => x !== it.art), { vis: V.emo(it.e, it.w), ot: "big", say: `der, die oder das ${it.w}?`, hint: `${it.art} ${it.w}`, key: "A:" + it.w }); }));
U("d_ie", "deut", 3, "🐝", "i oder ie?", T10(() => { const [w, x] = pick(list(IE)).split(":"); const i = w.toLowerCase().indexOf(x); const gap = w.slice(0, i) + '<span class="qbox">?</span>' + w.slice(i + x.length); return C("i oder ie?", i === 0 && w[0] === "I" ? x.toUpperCase().slice(0, 1) + x.slice(1) : x, [i === 0 && w[0] === "I" ? (x === "i" ? "Ie" : "I") : x === "i" ? "ie" : "i"], { vis: V.word(gap), ot: "big", max: 2, say: `${w}. Schreibt man das mit i oder mit ie?`, hint: `Richtig: ${w}`, key: "IE:" + w }); }));
U("d_gegen", "deut", 3, "↔️", "Gegenteile", T10(() => { const ps = pairs(GEGEN), p = pick(ps), [a, b] = Math.random() < 0.5 ? p : [p[1], p[0]]; return C(`Was ist das Gegenteil von „${a}“?`, b, sample(ps.filter(x => x !== p).flat(), 3), { ot: "word" }); }));
U("d_verb", "deut", 3, "🏃", "Verben beugen", T10(() => { const v = pick(KJ), i = R(0, 5), f = v.f[i]; return C(`${PRON[i].replace(" (viele)", "")} ___ (${v.v})`, f, [...new Set(v.f)].filter(x => x !== f), { ot: "word", say: `Welche Form passt? ${PRON[i] === "sie (viele)" ? "sie, also viele," : PRON[i]} … mit dem Verb ${v.v}.`, hint: `${PRON[i]} ${f}`, key: `K:${v.v}:${i}` }); }));
U("d_zus", "deut", 3, "🧩", "Wörter zusammensetzen", T10(() => { const [w1, a1, w2, a2, r] = pick(ZUS.split(";")).split("|"); const others = ["der", "die", "das"].filter(x => x !== a2); return C(`${a1} ${w1} + ${a2} ${w2} = ?`, `${a2} ${r}`, [`${others[0]} ${r}`, `${others[1]} ${r}`, `${a1} ${w2}${w1.toLowerCase()}`], { ot: "word", say: `Setze zusammen: ${a1} ${w1} und ${a2} ${w2}. Wie heißt das neue Wort mit Artikel?`, hint: "Das letzte Wort bestimmt den Artikel." }); }));
U("d_zeit", "deut", 4, "⏳", "Zeitformen", T10(() => tenseTask(false)));
U("d_praet", "deut", 4, "📜", "Verben in der Vergangenheit", T10(praetTask));
U("d_dass", "deut", 4, "🤔", "das oder dass?", () => qTasks(Q.dass, 10, { max: 2 }));
U("d_satzgl", "deut", 4, "🧱", "Subjekt und Prädikat", T10(() => satzglTask(["S", "P"])));
U("d_wf", "deut", 4, "🌳", "Wortfamilien", () => qTasks(Q.wf));
U("d_wart5", "deut", 5, "🏷️", "Alle Wortarten", T10(() => { const [w, a] = pick(list(WART5)).split("|"); return C(`Welche Wortart ist „${w}“?`, a, sample(WART5_ALL.filter(x => x !== a), 3), { ot: "word" }); }));
U("d_zeit5", "deut", 5, "⏳", "Alle sechs Zeitformen", T10(() => tenseTask(true)));
U("d_steig", "deut", 5, "📈", "Adjektive steigern", T10(steigTask));
U("d_komma", "deut", 5, "✒️", "Kommas setzen", () => qTasks(Q.komma));
U("d_satzgl5", "deut", 5, "🧱", "Satzglieder und Objekte", T10(() => satzglTask(["S", "P", "A", "D"])));
U("d_fall", "deut", 6, "🎯", "Die vier Fälle", () => qTasks(Q.fall, 10, {}).map(t => ({ ...t, vis: V.word(t.q), q: "In welchem Fall steht das fett gedruckte Wort?", say: `${t.q.replace(/<[^>]+>/g, "")} In welchem Fall steht „${(t.q.match(/<b>(.*?)<\/b>/) || ["", ""])[1]}“?` })));
U("d_aktiv", "deut", 6, "🔄", "Aktiv und Passiv", () => qTasks(Q.aktiv));
U("d_sss", "deut", 6, "🐍", "s, ss oder ß?", T10(() => { const [w, x] = pick(list(SSS)).split(":"); const i = w.lastIndexOf(x); return C("s, ss oder ß?", x, ["s", "ss", "ß"].filter(y => y !== x), { vis: V.word(w.slice(0, i) + '<span class="qbox">?</span>' + w.slice(i + x.length)), ot: "big", say: `${w}. Mit s, mit Doppel-s oder mit scharfem ß?`, hint: `Richtig: ${w}. Nach langem Vokal oder ei/au: ß. Nach kurzem Vokal: ss.`, key: "SS:" + w }); }));
U("d_syn", "deut", 6, "🔁", "Wörter mit gleicher Bedeutung", () => qTasks(Q.syn));
U("d_fremd", "deut", 6, "🌍", "Fremdwörter verstehen", () => qTasks(Q.fremd));

const UNIT = Object.fromEntries(UNITS.map(u => [u.id, u]));
const AREA = Object.fromEntries(AREAS.map(a => [a.id, a]));
