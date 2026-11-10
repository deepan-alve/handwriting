"use strict";

// ---------- constants ----------
const W = 1240, H = 1754; // A4 at 150 dpi

// [label, file, size scale, joined]
const FONTS = [
  ["Covered By Your Grace", "covered-by-your-grace", 1.15, 0],
  ["Nothing You Could Do", "nothing-you-could-do", 1.0, 0],
  ["Reenie Beanie", "reenie-beanie", 1.5, 0],
  ["Caveat", "caveat", 1.15, 0],
  ["Shadows Into Light", "shadows-into-light", 1.1, 0],
  ["Waiting for the Sunrise", "waiting-for-the-sunrise", 1.0, 0],
  ["Zeyada", "zeyada", 1.35, 0],
  ["Over the Rainbow", "over-the-rainbow", 1.1, 0],
  ["Sue Ellen Francisco", "sue-ellen-francisco", 1.5, 0],
  ["Just Another Hand", "just-another-hand", 1.6, 0],
  ["Gloria Hallelujah", "gloria-hallelujah", 0.9, 0],
  ["Indie Flower", "indie-flower", 1.0, 0],
  ["Schoolbell", "schoolbell", 1.0, 0],
  ["Patrick Hand", "patrick-hand", 1.05, 0],
  ["Rock Salt", "rock-salt", 0.8, 0],
  ["Homemade Apple", "homemade-apple", 0.8, 1],
  ["La Belle Aurore", "la-belle-aurore", 1.1, 1],
  ["Kristi", "kristi", 1.5, 1],
  ["Cedarville Cursive", "cedarville-cursive", 1.0, 1],
  ["Dawning of a New Day", "dawning-of-a-new-day", 1.2, 1],
  ["Mrs Saint Delafield", "mrs-saint-delafield", 1.7, 1],
];
const fontMeta = {};
FONTS.forEach(f => { fontMeta[f[0]] = { file: f[1], scale: f[2], joined: !!f[3] }; });

const PENS = {
  "Blue ballpoint": { color: "#1c3f9e", weight: 0.6, alpha: 0.9, grain: 0.10, bleed: 0.6, shadow: 0 },
  "Black ballpoint": { color: "#16171c", weight: 0.6, alpha: 0.92, grain: 0.10, bleed: 0.6, shadow: 0 },
  "Black gel": { color: "#0b0b0e", weight: 1.0, alpha: 1.0, grain: 0.0, bleed: 0.8, shadow: 0 },
  "Fountain pen": { color: "#1a2a63", weight: 0.4, alpha: 0.88, grain: 0.04, bleed: 1.1, shadow: 2.2 },
  "Felt tip": { color: "#202226", weight: 2.4, alpha: 0.9, grain: 0.03, bleed: 1.6, shadow: 0 },
  "Pencil": { color: "#4a4a52", weight: 0.5, alpha: 0.82, grain: 0.55, bleed: 0.4, shadow: 0 },
  "Red pen": { color: "#b3222a", weight: 0.6, alpha: 0.92, grain: 0.08, bleed: 0.6, shadow: 0 },
  "Green pen": { color: "#1d6b43", weight: 0.6, alpha: 0.92, grain: 0.08, bleed: 0.6, shadow: 0 },
  "Purple pen": { color: "#52308a", weight: 0.6, alpha: 0.92, grain: 0.08, bleed: 0.6, shadow: 0 },
  "Blue gel": { color: "#1743c9", weight: 1.0, alpha: 1.0, grain: 0.0, bleed: 0.8, shadow: 0 },
};
const PEN_ORDER = ["Blue ballpoint", "Blue gel", "Fountain pen", "Black ballpoint", "Black gel", "Felt tip", "Pencil", "Red pen", "Green pen", "Purple pen"];
const HILITES = { Yellow: "#ffe94d", Pink: "#ff9fc4", Green: "#9be58b", Blue: "#8fd3ff", Orange: "#ffb866" };
// {tag}text{/} in the text picks one of these
const COLOR_TAGS = { red: "Red pen", blue: "Blue ballpoint", black: "Black ballpoint", green: "Green pen", purple: "Purple pen", pencil: "Pencil", gel: "Black gel", bluegel: "Blue gel", felt: "Felt tip", fountain: "Fountain pen" };
const SCANS = ["Clean", "Flatbed scan", "Phone photo", "Close-up angle", "Far on desk", "Flash photo", "Dim room", "Scanner app", "Photocopy", "Mixed by page"];

const PAPERS = ["College ruled", "Wide ruled", "Plain", "Grid", "Dot grid", "Legal pad", "Aged"];

const SAMPLE =
`# Study notes: graph search
Name: Alex Morgan
Registration No.: 20240001

## Breadth-first search
- Explores level by level, so the first goal found is the **shallowest**.
- Uses a queue. Time and space are both O(b^d).
- {red}Not optimal{/} when step costs differ.
- ==Remember:== BFS finds the fewest moves, not the cheapest path.
- [x] Read chapter 3
- [ ] Practise on a grid maze

| Method | Complete | Optimal |
|---|---|---|
| BFS | yes | if costs are equal |
| DFS | no | no |
| UCS | yes | yes |

> A good plan today beats a perfect plan tomorrow.

Use __underline__ for key terms, ~~strike~~ for mistakes, and {green}green{/} or {purple}purple{/} pens for extra notes.
Arrows and logic symbols work too: A → B, x ≠ y, p ∧ q ⇒ r.`;

// ---------- controls schema ----------
// tab, fold/g (grouping), id, label, type, min, max, step, def, options
const PRESETS = {
  "Exam answers": { font: "Reenie Beanie", size: 34, lineH: 54, marginL: 120, marginR: 100, marginT: 130, slant: 6, pen: "Blue ballpoint", headPen: "Black ballpoint", boxPen: "Pencil", paper: "Plain", scan: "Close-up angle", tilt: 0.5, lineDrift: 1.2, wordGap: 1.15, mess: 1, letterVar: 1, wander: 1, fatigue: 0.3 },
  "Neat cursive": { font: "La Belle Aurore", size: 40, lineH: 58, marginL: 130, marginR: 95, marginT: 140, slant: 6, pen: "Blue ballpoint", headPen: "Black ballpoint", boxPen: "Pencil", paper: "Plain", scan: "Close-up angle", tilt: 0.5, lineDrift: 1, wordGap: 1.1, mess: 1, letterVar: 0.8, wander: 1, fatigue: 0.3 },
  "Round and tidy": { font: "Caveat", size: 42, lineH: 58, marginL: 130, marginR: 95, marginT: 140, slant: 6, pen: "Blue ballpoint", headPen: "Black ballpoint", boxPen: "Pencil", paper: "Plain", scan: "Scanner app", tilt: 0.4, lineDrift: 1, wordGap: 1.1, mess: 0.8, letterVar: 0.9, wander: 0.9, fatigue: 0.2 },
  "Student notes": { font: "Covered By Your Grace", size: 40, slant: 6, pen: "Blue ballpoint", headPen: "Black ballpoint", boxPen: "Pencil", paper: "College ruled", scan: "Flatbed scan", mess: 1, letterVar: 1, wander: 1, lineDrift: 1, fatigue: 0.3, wordGap: 1.1, lineH: 54, marginL: 150, marginR: 90, marginT: 150 },
  "Quick pencil": { font: "Nothing You Could Do", size: 42, slant: 10, pen: "Pencil", headPen: "Pencil", boxPen: "Pencil", paper: "Plain", scan: "Phone photo", mess: 1.3, letterVar: 1.2, wander: 1.4, lineDrift: 1.3, fatigue: 0.5, wordGap: 1.05 },
  "Fountain pen": { font: "Cedarville Cursive", size: 42, slant: 8, pen: "Fountain pen", headPen: "Fountain pen", boxPen: "Pencil", paper: "Aged", scan: "Flatbed scan", mess: 0.8, letterVar: 0.8, wander: 0.8, lineDrift: 0.8, fatigue: 0.2, wordGap: 1.1 },
  "Hurried scrawl": { font: "Reenie Beanie", size: 40, slant: 14, pen: "Black ballpoint", headPen: "Black ballpoint", boxPen: "Pencil", paper: "Legal pad", scan: "Dim room", mess: 1.6, letterVar: 1.5, wander: 1.5, lineDrift: 1.5, fatigue: 0.8, wordGap: 0.95 },
};

const CONTROLS = [
  { tab: "hand", id: "preset", label: "Ready made looks", type: "chips", options: Object.keys(PRESETS), def: "" },
  { tab: "hand", id: "font", label: "Handwriting", type: "fonts", options: FONTS.map(f => f[0]), def: FONTS[0][0] },
  { tab: "hand", id: "size", label: "Size", type: "range", min: 24, max: 80, step: 1, def: 40 },
  { tab: "hand", id: "slant", label: "Slant", type: "range", min: -15, max: 30, step: 1, def: 6, unit: "°" },
  { tab: "hand", id: "align", label: "Align", type: "seg", options: ["left", "center", "right"], def: "left" },
  { tab: "hand", id: "indent", label: "Paragraph indent", type: "range", min: 0, max: 120, step: 2, def: 0 },
  { tab: "hand", fold: "Realism", id: "mess", label: "Overall messiness", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "letterVar", label: "Letter to letter variation", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "warp", label: "Unique letter shapes", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "wander", label: "Baseline wander", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "lineDrift", label: "Line tilt drift", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "spaceVar", label: "Spacing variation", type: "range", min: 0, max: 2, step: 0.05, def: 1 },
  { tab: "hand", fold: "Realism", id: "wordGap", label: "Word gap", type: "range", min: 0.6, max: 2, step: 0.05, def: 1.1 },
  { tab: "hand", fold: "Realism", id: "pressure", label: "Pressure variation", type: "range", min: 0, max: 1, step: 0.05, def: 0.5 },
  { tab: "hand", fold: "Realism", id: "fatigue", label: "Gets sloppier down the page", type: "range", min: 0, max: 1, step: 0.05, def: 0.3 },
  { tab: "ink", id: "pen", label: "Body text", hint: "Normal text", type: "pen", def: "Blue ballpoint" },
  { tab: "ink", id: "boldPen", label: "Bold", hint: "**bold**", type: "pen", same: "As body", sameVal: "Same as body", def: "Same as body" },
  { tab: "ink", id: "headPen", label: "Headings", hint: "# Heading", type: "pen", same: "As body", sameVal: "Same as body", def: "Black ballpoint" },
  { tab: "ink", id: "h2Pen", label: "Subheadings", hint: "## Subheading", type: "pen", same: "As headings", sameVal: "Same as heading", def: "Same as heading" },
  { tab: "ink", id: "boxPen", label: "Table lines and rules", hint: "| table | and ---", type: "pen", same: "As body", sameVal: "Same as body", def: "Pencil" },
  { tab: "ink", id: "thPen", label: "Table header", hint: "first row before |---|", type: "pen", same: "As body", sameVal: "Same as body", def: "Same as body" },
  { tab: "ink", id: "quotePen", label: "Quotes", hint: "> quote", type: "pen", same: "As body", sameVal: "Same as body", def: "Pencil" },
  { tab: "ink", id: "hilite", label: "Highlighter", hint: "==highlight==", type: "hl", options: Object.keys(HILITES), def: "Yellow" },
  { tab: "ink", fold: "Fine tune the body pen", id: "color", label: "Ink colour", type: "color", def: PENS["Blue ballpoint"].color },
  { tab: "ink", fold: "Fine tune the body pen", id: "weight", label: "Stroke weight", type: "range", min: 0, max: 4, step: 0.1, def: 0.6 },
  { tab: "ink", fold: "Fine tune the body pen", id: "bleed", label: "Ink bleed", type: "range", min: 0, max: 3, step: 0.1, def: 0.6 },
  { tab: "ink", fold: "Fine tune the body pen", id: "grain", label: "Ink texture", type: "range", min: 0, max: 0.8, step: 0.02, def: 0.1 },
  { tab: "paper", id: "paper", label: "Paper", type: "chips", options: PAPERS, def: "Plain" },
  { tab: "paper", id: "lineH", label: "Line spacing", type: "range", min: 36, max: 90, step: 1, def: 54 },
  { tab: "paper", id: "marginL", label: "Left margin", type: "range", min: 40, max: 260, step: 2, def: 130 },
  { tab: "paper", id: "marginR", label: "Right margin", type: "range", min: 30, max: 200, step: 2, def: 95 },
  { tab: "paper", id: "marginT", label: "Top margin", type: "range", min: 40, max: 300, step: 2, def: 140 },
  { tab: "paper", id: "paperGrain", label: "Paper texture", type: "range", min: 0, max: 1, step: 0.05, def: 0.4 },
  { tab: "camera", id: "scan", label: "Scan or photo look", type: "looks", options: SCANS, def: "Close-up angle" },
  { tab: "camera", id: "camFlaw", label: "How bad the camera is", type: "range", min: 0, max: 1.5, step: 0.05, def: 0.7 },
  { tab: "camera", id: "tilt", label: "Page tilt", type: "range", min: 0, max: 3, step: 0.1, def: 0.5, unit: "°" },
  { tab: "camera", id: "shade", label: "Uneven lighting", type: "range", min: 0, max: 1, step: 0.05, def: 0.4 },
  { tab: "camera", id: "noise", label: "Sensor noise", type: "range", min: 0, max: 1, step: 0.05, def: 0.3 },
];

const state = { text: SAMPLE, seed: 4242 };
CONTROLS.forEach(c => { state[c.id] = c.def; });

const LS_KEY = "handwriting.v1";
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const o = JSON.parse(raw);
    for (const k in o) if (k in state) state[k] = o[k];
    if (state.scan === "Bad phone camera") state.scan = "Close-up angle";
  } catch (e) { /* storage unavailable */ }
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

// ---------- seeded randomness ----------
function hash(a, b, c) {
  let h = (a ^ 0x9e3779b9) | 0;
  h = Math.imul(h ^ b, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h ^ c, 0xc2b2ae35);
  h ^= h >>> 16;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
// roughly gaussian, mostly within -1..1
function gauss(seed, i, k) {
  return (hash(seed, i, k) + hash(seed, i, k + 101) + hash(seed, i, k + 202) - 1.5) * 1.6;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(seed, line, x) {
  const i = Math.floor(x), f = x - i;
  const a = hash(seed, line, i) * 2 - 1, b = hash(seed, line, i + 1) * 2 - 1;
  return a + (b - a) * smooth(f);
}

// ---------- fonts ----------
const loadedFonts = new Set();
const otFonts = {}; // parsed outlines, used to give every letter its own shape
const fontReady = {}; // true once a font and its outlines were tried
const fontJobs = {};
// fonts load on demand: the page font first, the rest only for the font cards
function ensureFont(name, outline = true) {
  const f = FONTS.find(x => x[0] === name);
  if (!f) return Promise.resolve();
  const key = name + (outline ? "|outline" : "");
  if (fontJobs[key]) return fontJobs[key];
  fontJobs[key] = (async () => {
    if (!loadedFonts.has(name)) {
      try {
        const ff = new FontFace(f[0], `url(fonts/${f[1]}.woff2)`);
        await ff.load();
        document.fonts.add(ff);
        loadedFonts.add(name);
      } catch (e) { console.warn("font failed", name, e); }
    }
    if (outline && !otFonts[name]) {
      try { otFonts[name] = opentype.parse(await (await fetch(`fonts/${f[1]}.woff`)).arrayBuffer()); }
      catch (e) { console.warn("outline parse failed", name); }
    }
    if (outline) fontReady[name] = true;
  })();
  return fontJobs[key];
}
let cardFontsLoaded = false;
function loadCardFonts() {
  if (cardFontsLoaded) return;
  cardFontsLoaded = true;
  FONTS.forEach(f => ensureFont(f[0], false));
}

// ---------- layout ----------
const measureCtx = document.createElement("canvas").getContext("2d");

// Hand drawn symbols for characters the fonts lack. Units are em, y points up from the baseline.
const arc = (cx, cy, rx, ry, a0, a1, n = 14) => {
  const p = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return p;
};
const SYMBOLS = {
  "→": { adv: 0.8, strokes: [[[0, 0.3], [0.66, 0.3]], [[0.47, 0.47], [0.68, 0.3], [0.47, 0.13]]] },
  "⇒": { adv: 0.8, strokes: [[[0, 0.4], [0.58, 0.4]], [[0, 0.2], [0.58, 0.2]], [[0.4, 0.56], [0.63, 0.3], [0.4, 0.04]]] },
  "∧": { adv: 0.62, strokes: [[[0, 0], [0.26, 0.62], [0.52, 0]]] },
  "∨": { adv: 0.62, strokes: [[[0, 0.62], [0.26, 0], [0.52, 0.62]]] },
  "∀": { adv: 0.68, strokes: [[[0, 0.72], [0.29, 0], [0.58, 0.72]], [[0.12, 0.3], [0.46, 0.3]]] },
  "∃": { adv: 0.55, strokes: [[[0, 0.72], [0.42, 0.72], [0.42, 0], [0, 0]], [[0.42, 0.36], [0.1, 0.36]]] },
  "¬": { adv: 0.6, strokes: [[[0, 0.38], [0.46, 0.38], [0.46, 0.15]]] },
  "≠": { adv: 0.62, strokes: [[[0, 0.38], [0.46, 0.38]], [[0, 0.18], [0.46, 0.18]], [[0.38, 0.58], [0.1, -0.02]]] },
  "≤": { adv: 0.62, strokes: [[[0.46, 0.64], [0, 0.4], [0.46, 0.16]], [[0, 0.02], [0.46, 0.02]]] },
  "≥": { adv: 0.62, strokes: [[[0, 0.64], [0.46, 0.4], [0, 0.16]], [[0, 0.02], [0.46, 0.02]]] },
  "∞": { adv: 0.85, strokes: [(() => { const p = []; for (let i = 0; i <= 28; i++) { const t = i / 28 * 6.283; const d = 1 + Math.sin(t) ** 2; p.push([0.38 + 0.38 * Math.cos(t) / d, 0.3 + 0.55 * Math.sin(t) * Math.cos(t) / d]); } return p; })()] },
  "α": { adv: 0.6, strokes: [[...arc(0.26, 0.26, 0.24, 0.26, -0.6, -6.2, 16), [0.5, 0.52], [0.5, 0.14], [0.6, 0]]] },
  "β": { adv: 0.58, strokes: [[[0.02, -0.28], [0.04, 0.3], [0.1, 0.62], [0.26, 0.74], [0.4, 0.62], [0.3, 0.44], [0.12, 0.4], [0.36, 0.34], [0.48, 0.16], [0.34, 0.01], [0.12, 0.03]]] },
  "Δ": { adv: 0.72, strokes: [[[0, 0], [0.32, 0.74], [0.64, 0], [0, 0]]] },
  "×": { adv: 0.6, strokes: [[[0.04, 0.52], [0.46, 0.04]], [[0.46, 0.52], [0.04, 0.04]]] },
  "✓": { adv: 0.7, strokes: [[[0, 0.26], [0.16, 0.04], [0.58, 0.66]]] },
  "☐": { adv: 0.7, strokes: [[[0.02, 0.02], [0.56, 0.05], [0.55, 0.58], [0.03, 0.55], [0.02, 0.02]]] },
  "☑": { adv: 0.7, strokes: [[[0.02, 0.02], [0.56, 0.05], [0.55, 0.58], [0.03, 0.55], [0.02, 0.02]], [[0.1, 0.3], [0.24, 0.1], [0.68, 0.78]]] },
  "✗": { adv: 0.62, strokes: [[[0.03, 0.62], [0.5, 0.02]], [[0.5, 0.62], [0.03, 0.02]]] },
};
const NORMALIZE = [
  [/[−]/g, "-"], [/[’′‘]/g, "'"], [/[“”]/g, '"'], [/…/g, "..."],
  [/⁴/g, "^4"], [/⁸/g, "^8"], [/[•●]/g, "-"], [/[⩽]/g, "≤"], [/[⩾]/g, "≥"],
  [/[✔✓]/g, "✓"], [/[✘✗]/g, "✗"], [/→|➔|➜/g, "→"],
];
function normalizeText(t) { return NORMALIZE.reduce((a, [re, to]) => a.replace(re, to), t); }

// inline markup: **bold** *italic* ==mark== __underline__ ~~strike~~ `code` {red}text{/}
const NOSTYLE = {};
const MK = { "": ["bold", 1], "": ["bold", 0], "": ["it", 1], "": ["it", 0], "": ["mark", 1], "": ["mark", 0], "": ["ul", 1], "": ["ul", 0], "": ["strike", 1], "": ["strike", 0], "": ["ink", "Pencil"], "": ["ink", null] };
function parseInline(str) {
  const t = str
    .replace(/\*\*(?=\S)([^*]+?)(?<=\S)\*\*/g, "$1")
    .replace(/(?<![\w*])\*(?=\S)([^*]+?)(?<=\S)\*(?![\w*])/g, "$1")
    .replace(/==(?=\S)(.+?)(?<=\S)==/g, "$1")
    .replace(/__(?=\S)(.+?)(?<=\S)__/g, "$1")
    .replace(/~~(?=\S)(.+?)(?<=\S)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{(\w+)\}/g, (m, k) => COLOR_TAGS[k] ? "" + k + "" : m)
    .replace(/\{\/\}/g, "");
  const st = { bold: 0, it: 0, mark: 0, ul: 0, strike: 0, ink: null };
  const words = []; let cur = null;
  const flush = () => { if (cur) { words.push(cur); cur = null; } };
  for (const part of t.split(/([-]|\w+)/)) {
    if (MK[part]) { st[MK[part][0]] = MK[part][1]; continue; }
    if (part.charCodeAt(0) === 0xE00D) { st.ink = COLOR_TAGS[part.slice(1, -1)]; continue; }
    for (const ch of part) {
      if (ch === " ") flush();
      else { if (!cur) cur = { text: "", st: { ...st } }; cur.text += ch; }
    }
  }
  flush();
  return words;
}

function layoutText(s) {
  const meta = fontMeta[s.font] || { scale: 1, joined: false };
  const baseSize = s.size * meta.scale;
  const joined = meta.joined;
  const jf = joined ? 0.25 : 1;
  const otf = otFonts[s.font];
  const left = s.marginL, right = W - s.marginR, maxW = right - left;
  const slantK = Math.tan(s.slant * Math.PI / 180);
  const lh = s.lineH;
  let uid = 0;
  const useFont = sz => { measureCtx.font = `${sz}px "${s.font}"`; };
  const supported = ch => !otf || otf.charToGlyph(ch).index !== 0;

  function buildWord(wo, size) {
    const word = typeof wo === "string" ? wo : wo.text, st = typeof wo === "string" ? NOSTYLE : wo.st;
    useFont(size);
    const wid = ++uid, pieces = [];
    let ww = 0, run = "";
    const add = (t, adv, sym) => {
      const sp = (joined || sym) ? 0 : gauss(s.seed, wid * 7 + pieces.length, 5) * 0.045 * s.spaceVar * s.mess;
      pieces.push({ t, adv, sp: adv * sp, sym }); ww += adv + adv * sp;
    };
    const flush = () => { if (run) { add(run, measureCtx.measureText(run).width); run = ""; } };
    for (const ch of Array.from(word)) {
      if (SYMBOLS[ch]) { flush(); add(ch, SYMBOLS[ch].adv * size, SYMBOLS[ch]); }
      else if (!supported(ch)) continue;
      else if (joined) run += ch;
      else add(ch, measureCtx.measureText(ch).width);
    }
    flush();
    return { word: pieces, ww, wid, size, st };
  }
  const gapFor = (size, b) => { useFont(size); return measureCtx.measureText(" ").width * s.wordGap * (1 + gauss(s.seed, b.wid, 9) * 0.22 * s.spaceVar * s.mess); };

  // one unbroken line of text starting at startX
  function flow(str, size, startX) {
    const units = []; let x = startX;
    parseInline(str).forEach((w, i) => {
      const b = buildWord(w, size);
      b.x0 = i ? x + gapFor(size, b) : x;
      x = b.x0 + b.ww; units.push(b);
    });
    return { units, width: x };
  }

  const rows = [];
  // wrapped paragraph with optional hanging marker
  function paragraph(text, size, firstX, restX, marker, markerX, extra) {
    const words = parseInline(text).map(w => buildWord(w, size));
    let cur = { units: [], width: firstX, size, hasText: false, ...extra };
    if (marker) { const mb = buildWord(marker, size); mb.x0 = markerX; cur.units.push(mb); }
    for (const b of words) {
      let x0 = cur.hasText ? cur.width + gapFor(size, b) : cur.width;
      if (cur.hasText && x0 + b.ww > maxW) {
        rows.push(cur); cur = { units: [], width: restX, size, hasText: false, ...extra, noUnderline: true };
        x0 = restX;
      }
      b.x0 = x0; cur.units.push(b); cur.width = x0 + b.ww; cur.hasText = true;
    }
    rows.push(cur);
  }

  function table(tbl) {
    const ncol = Math.max(...tbl.map(r => r.length));
    const pad = 18;
    let size = baseSize;
    let widths;
    for (let attempt = 0; attempt < 4; attempt++) {
      widths = Array(ncol).fill(0);
      tbl.forEach(r => r.forEach((c, i) => { widths[i] = Math.max(widths[i], flow(c, size, 0).width + pad * 2); }));
      const total = widths.reduce((a, b) => a + b, 0);
      if (total <= maxW) break;
      size = Math.max(baseSize * 0.7, size * (maxW / total) * 0.98);
    }
    const xs = [0]; widths.forEach(w => xs.push(xs[xs.length - 1] + w));
    tbl.forEach((r, ri) => {
      const units = [];
      r.forEach((c, i) => flow(c, size, xs[i] + pad).units.forEach(u => units.push(u)));
      const hdr = !!tbl.hdr && ri === 0;
      rows.push({ units, width: xs[xs.length - 1], size, role: hdr ? "th" : "body", table: { xs, first: ri === 0, hdr } });
    });
  }

  const lines = normalizeText(s.text).replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|/.test(line)) {
      const tbl = []; let k = 0;
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        if (/^\s*\|[\s:|-]+\|?\s*$/.test(lines[i])) { if (k === 1) tbl.hdr = true; }
        else { tbl.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim())); k++; }
        i++;
      }
      i--; if (tbl.length) table(tbl); continue;
    }
    if (!line.trim()) { rows.push({ units: [], width: 0, size: baseSize, blank: true }); continue; }
    if (/^\s*(\\newpage|\\pagebreak|<<<)\s*$/.test(line)) { rows.push({ pageBreak: true, units: [] }); continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { rows.push({ units: [], width: 0, size: baseSize, rule: true }); continue; }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      if (n === 1) paragraph(h[2], baseSize * 1.18, 0, 0, null, 0, { underline: true, role: "head" });
      else paragraph(h[2], baseSize * (n === 2 ? 1.08 : 1), 0, 0, null, 0, { role: "h2" });
      continue;
    }
    const q = line.match(/^>\s?(.*)$/);
    if (q) { paragraph(q[1], baseSize, 34, 34, null, 0, { role: "quote", bar: true }); continue; }
    const b = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (b) {
      const lvl = Math.floor(b[1].length / 2);
      const mx = 14 + lvl * 44, tx = mx + 40;
      let marker = /^\d/.test(b[2]) ? b[2] : "-", txt = b[3];
      const cb = txt.match(/^\[( |x|X)\]\s+(.*)$/);
      if (cb) { marker = cb[1] === " " ? "☐" : "☑"; txt = cb[2]; }
      paragraph(txt, baseSize, tx, tx, marker, mx, {});
      continue;
    }
    paragraph(line.trim(), baseSize, s.indent, 0, null, 0, {});
  }

  const perPage = Math.max(1, Math.floor((H - s.marginT - 90) / lh));
  const pages = [[]];
  let pr = 0;
  const inkOf = (row, st) => {
    if (st && st.ink) return "p:" + st.ink;
    const base = row.role || "body";
    return (st && st.bold && (base === "body" || base === "quote")) ? "bold" : base;
  };

  rows.forEach((row, li) => {
    if (row.pageBreak) { if (pr > 0) { pages.push([]); pr = 0; } return; }
    if (row.blank && pr === 0) return;
    if (pr >= perPage) { pages.push([]); pr = 0; }
    const r = pr++, out = pages[pages.length - 1];
    const depth = r / perPage;
    const tired = 1 + s.fatigue * depth * 0.9;
    const mess = s.mess * tired;
    const lineY = s.marginT + (r + 1) * lh;
    const tilt = gauss(s.seed, li, 1) * 0.0035 * s.lineDrift * mess;
    const tanT = Math.tan(tilt);
    const ox = row.table ? 0 : (hash(s.seed, li, 2) - 0.5) * 14 * mess;
    let shift = 0;
    if (!row.table && !row.underline) {
      if (s.align === "center") shift = (maxW - row.width) / 2;
      else if (s.align === "right") shift = maxW - row.width;
    }
    const base = row.table ? lineY - lh * 0.3 : lineY - lh * 0.12;
    const wob2 = (k) => gauss(s.seed, li * 13 + k, 61) * 2.5 * mess;
    row.units.forEach((wu, wi) => {
      let x = left + ox + shift + wu.x0;
      const xw0 = x;
      const wy = gauss(s.seed, wu.wid, 11) * 1.8 * mess;
      const wrot = gauss(s.seed, wu.wid, 13) * 0.018 * mess + tilt;
      const role = inkOf(row, wu.st), it = wu.st.it ? 0.2 : 0;
      wu.word.forEach(p => {
        const id = ++uid;
        const lv = s.letterVar * mess * jf;
        const wob = vnoise(s.seed + 7, li, (x - left) / 260) * 5 * s.wander * mess;
        const y = base + (x - left) * tanT + wob + wy + gauss(s.seed, id, 21) * 1.7 * lv;
        const rot = wrot + gauss(s.seed, id, 23) * 0.045 * lv;
        const sc = 1 + gauss(s.seed, id, 25) * 0.05 * lv;
        const pr2 = s.pressure * (0.5 + 0.5 * tired / 1.3);
        const alpha = Math.max(0.35, 1 - Math.abs(gauss(s.seed, id, 27)) * 0.45 * pr2);
        const wp = [];
        for (let k = 0; k < 8; k++) wp.push(k % 2 ? hash(s.seed, id, 40 + k) * 6.283 : gauss(s.seed, id, 40 + k));
        out.push({ role, it, t: p.t, sym: p.sym, size: wu.size, id, x, y, rot, sx: sc * (1 + gauss(s.seed, id, 29) * 0.03 * lv), sy: sc, alpha, wp, lv0: s.letterVar * mess, joined });
        x += p.adv + p.sp;
      });
      const st = wu.st;
      if (st.mark || st.ul || st.strike) {
        const nxt = row.units[wi + 1];
        const reach = flag => nxt && nxt.st[flag] ? Math.max(0, nxt.x0 - wu.x0 - wu.ww) : 0;
        const x1 = xw0 + wu.ww;
        const yb = base + (xw0 - left) * tanT + vnoise(s.seed + 7, li, (xw0 - left) / 260) * 5 * s.wander * mess + wy;
        if (st.mark) out.push({ kind: "mark", x: xw0 - 4, y: yb - wu.size * 0.78, w: x1 - xw0 + 8 + reach("mark"), h: wu.size * 1.02, id: ++uid });
        if (st.ul) out.push({ role, kind: "line", x1: xw0, y1: yb + wu.size * 0.16, x2: x1 + reach("ul"), y2: yb + wu.size * 0.16 + wob2(3) * 0.5, id: ++uid });
        if (st.strike) out.push({ role, kind: "line", x1: xw0 - 2, y1: yb - wu.size * 0.26, x2: x1 + 2 + reach("strike"), y2: yb - wu.size * 0.26 + wob2(4) * 0.5, id: ++uid });
      }
    });
    if (row.table) {
      const T = row.table, top = lineY - lh;
      if (T.first) out.push({ role: "box", kind: "line", x1: left, y1: top + wob2(1), x2: left + T.xs[T.xs.length - 1], y2: top + wob2(2), id: li * 50 + 1 });
      out.push({ role: "box", kind: "line", x1: left, y1: lineY + wob2(3), x2: left + T.xs[T.xs.length - 1], y2: lineY + wob2(4), id: li * 50 + 2 });
      if (T.hdr) out.push({ role: "box", kind: "line", x1: left, y1: lineY + 4 + wob2(6), x2: left + T.xs[T.xs.length - 1], y2: lineY + 4 + wob2(7), id: li * 50 + 30 });
      T.xs.forEach((tx, k) => out.push({ role: "box", kind: "line", x1: left + tx + wob2(5 + k), y1: top, x2: left + tx + wob2(20 + k), y2: lineY, id: li * 50 + 3 + k }));
    }
    if (row.underline && !row.noUnderline && row.hasText) {
      const y = base + row.size * 0.2;
      out.push({ role: "head", kind: "line", x1: left + shift - 4, y1: y + wob2(1), x2: left + shift + row.width + 6, y2: y + wob2(2) - 1.5, id: li * 50 + 1 });
    }
    if (row.bar) out.push({ role: "quote", kind: "line", x1: left + 12 + wob2(7) * 0.3, y1: lineY - lh * 0.88, x2: left + 12 + wob2(8) * 0.3, y2: lineY + 2, id: li * 50 + 9 });
    if (row.rule) out.push({ role: "box", kind: "line", x1: left, y1: lineY - lh * 0.35 + wob2(1), x2: left + maxW * 0.97, y2: lineY - lh * 0.35 + wob2(2), id: li * 50 + 10 });
  });
  return { pages, size: baseSize, slantK };
}


// ---------- paper ----------
const paperCache = { key: "", canvas: null };

function paperKey(s) {
  return JSON.stringify([s.paper, s.lineH, s.marginL, s.marginT, s.paperGrain, s.seed]);
}

function buildPaper(s) {
  const key = paperKey(s);
  if (paperCache.key === key) return paperCache.canvas;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const tones = {
    "Legal pad": [252, 243, 170],
    "Aged": [238, 226, 196],
  };
  const tone = tones[s.paper] || [253, 253, 251];
  g.fillStyle = `rgb(${tone[0]},${tone[1]},${tone[2]})`;
  g.fillRect(0, 0, W, H);

  // fibres and grain
  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  const amt = s.paperGrain * 14;
  let seed = s.seed * 31 + 5;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * amt;
    d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9;
  }
  g.putImageData(img, 0, 0);
  // soft blotches
  for (let i = 0; i < 40 * s.paperGrain; i++) {
    const x = rnd() * W, y = rnd() * H, r = 60 + rnd() * 260;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = rnd() < 0.5;
    gr.addColorStop(0, dark ? "rgba(120,100,70,0.035)" : "rgba(255,255,255,0.05)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  if (s.paper === "Aged") {
    const gr = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.78);
    gr.addColorStop(0, "rgba(160,120,60,0)");
    gr.addColorStop(1, "rgba(150,110,50,0.28)");
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }

  const lh = s.lineH;
  const lineCol = s.paper === "Legal pad" ? "rgba(110,150,190,0.75)" : "rgba(120,160,215,0.65)";
  const ruled = s.paper === "College ruled" || s.paper === "Wide ruled" || s.paper === "Legal pad" || s.paper === "Aged";
  if (ruled) {
    g.strokeStyle = lineCol; g.lineWidth = 1.6;
    for (let y = s.marginT + lh; y < H - 40; y += lh) {
      g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke();
    }
    // header line
    g.strokeStyle = "rgba(120,160,215,0.65)";
    g.beginPath(); g.moveTo(0, s.marginT - lh * 0.0 + 0.5); g.lineTo(W, s.marginT + 0.5); g.stroke();
    const mx = s.marginL - 28;
    g.strokeStyle = "rgba(215,105,105,0.7)"; g.lineWidth = 1.8;
    g.beginPath(); g.moveTo(mx, 0); g.lineTo(mx, H); g.stroke();
    if (s.paper === "Legal pad") {
      g.beginPath(); g.moveTo(mx + 6, 0); g.lineTo(mx + 6, H); g.stroke();
    }
  } else if (s.paper === "Grid") {
    g.strokeStyle = "rgba(120,160,215,0.45)"; g.lineWidth = 1.2;
    for (let y = s.marginT % lh; y < H; y += lh) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
    for (let x = s.marginL % lh; x < W; x += lh) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
  } else if (s.paper === "Dot grid") {
    g.fillStyle = "rgba(110,120,140,0.55)";
    for (let y = s.marginT % lh; y < H; y += lh) for (let x = s.marginL % lh; x < W; x += lh) {
      g.beginPath(); g.arc(x, y, 1.7, 0, 7); g.fill();
    }
  }
  // ruled rows sit on lines; for grid and dots the base is the row line too
  paperCache.key = key; paperCache.canvas = c;
  return c;
}

// ---------- ink ----------
const inkCanvas = document.createElement("canvas");
inkCanvas.width = W; inkCanvas.height = H;
const ink = inkCanvas.getContext("2d");
const grainCache = { key: "", pattern: null };

function grainPattern(strength, seedN) {
  const key = strength + ":" + seedN;
  if (grainCache.key === key) return grainCache.pattern;
  const t = document.createElement("canvas"); t.width = t.height = 256;
  const g = t.getContext("2d");
  const img = g.createImageData(256, 256);
  let sd = seedN * 977 + 3;
  const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
  for (let i = 0; i < img.data.length; i += 4) {
    const r = rnd();
    img.data[i + 3] = r < strength ? 255 * (0.35 + 0.65 * rnd()) : 0;
  }
  g.putImageData(img, 0, 0);
  grainCache.key = key;
  grainCache.pattern = ink.createPattern(t, "repeat");
  return grainCache.pattern;
}

// ---------- hand drawn lines and symbols ----------
function drawLine(s, u, pen) {
  const len = Math.hypot(u.x2 - u.x1, u.y2 - u.y1);
  const n = Math.max(2, Math.ceil(len / 14));
  const nx = -(u.y2 - u.y1) / len, ny = (u.x2 - u.x1) / len;
  ink.save();
  ink.globalAlpha = 0.92 * pen.alpha;
  ink.lineWidth = 1.9 + s.weight * 0.9;
  ink.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const off = vnoise(s.seed + 3, u.id, t * len / 160) * 1.1 * s.mess;
    const x = u.x1 + (u.x2 - u.x1) * t + nx * off, y = u.y1 + (u.y2 - u.y1) * t + ny * off;
    if (i) ink.lineTo(x, y); else ink.moveTo(x, y);
  }
  ink.stroke();
  ink.restore();
}

function drawSymbol(s, u, slantK, pen) {
  const size = u.size, a = u.wp;
  const amp = size * 0.02 * Math.min(u.lv0, 2) * Math.max(s.warp, 0.2);
  ink.save();
  ink.translate(u.x, u.y);
  ink.rotate(u.rot);
  ink.transform(1, 0, -slantK, 1, 0, 0);
  ink.scale(u.sx, u.sy);
  ink.globalAlpha = u.alpha * pen.alpha;
  ink.lineWidth = size * 0.058 + s.weight * 0.7;
  for (const stroke of u.sym.strokes) {
    ink.beginPath();
    let first = true;
    for (let i = 0; i < stroke.length - 1; i++) {
      const [x0, y0] = stroke[i], [x1, y1] = stroke[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * size / 8));
      for (let k = (i ? 1 : 0); k <= n; k++) {
        const t = k / n, ex = x0 + (x1 - x0) * t, ey = y0 + (y1 - y0) * t;
        const px = ex * size, py = -ey * size;
        const dx = amp * (a[0] * Math.sin(px * 0.07 + a[1]) + a[2] * Math.sin(py * 0.09 + a[3]));
        const dy = amp * (a[4] * Math.sin(px * 0.08 + a[5]) + a[6] * Math.sin(py * 0.06 + a[7]));
        if (first) { ink.moveTo(px + dx, py + dy); first = false; } else ink.lineTo(px + dx, py + dy);
      }
    }
    ink.stroke();
  }
  ink.restore();
}

// ---------- per-letter outline warp ----------
const outlineCache = new Map();
function contoursFor(font, name, text, size) {
  const key = name + "|" + size + "|" + text;
  let c = outlineCache.get(key);
  if (c) return c;
  const cmds = font.getPath(text, 0, 0, size).commands;
  const step = Math.max(1.2, size * 0.035);
  c = []; let cur = null, px = 0, py = 0;
  const seg = (x, y, f) => {
    const n = Math.max(2, Math.ceil(Math.hypot(x - px, y - py) / step));
    for (let i = 1; i <= n; i++) { const [a, b] = f(i / n); cur.push([a, b]); }
    px = x; py = y;
  };
  for (const m of cmds) {
    if (m.type === "M") { cur = [[m.x, m.y]]; c.push(cur); px = m.x; py = m.y; }
    else if (m.type === "L") { cur.push([m.x, m.y]); px = m.x; py = m.y; }
    else if (m.type === "Q") { const x0 = px, y0 = py; seg(m.x, m.y, t => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * m.x1 + t * t * m.x, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * m.y1 + t * t * m.y]); }
    else if (m.type === "C") { const x0 = px, y0 = py; seg(m.x, m.y, t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * m.x1 + 3 * u * t * t * m.x2 + t * t * t * m.x, u * u * u * y0 + 3 * u * u * t * m.y1 + 3 * u * t * t * m.y2 + t * t * t * m.y]; }); }
  }
  if (outlineCache.size > 6000) outlineCache.clear();
  outlineCache.set(key, c);
  return c;
}

function drawWarped(s, font, u, size, slantK, pen) {
  size = u.size || size;
  const contours = contoursFor(font, s.font, u.t, size);
  const k = s.warp * Math.min(u.lv0, 2) * (u.joined ? 0.6 : 1);
  const amp = size * 0.016 * k;
  const wl = size * (u.joined ? 2.6 : 1.5);
  const f1 = 6.283 / wl, f2 = 6.283 / (size * 1.1), f3 = 6.283 / (wl * 0.8), f4 = 6.283 / (size * 0.9);
  const a = u.wp;
  const rough = 0.22 * s.warp;
  const path = new Path2D();
  for (const ct of contours) {
    ct.forEach((pt, i) => {
      const x = pt[0], y = pt[1];
      let dx = amp * (a[0] * Math.sin(x * f1 + a[1]) + a[2] * Math.sin(y * f2 + a[3]));
      let dy = amp * (a[4] * Math.sin(x * f3 + a[5]) + a[6] * Math.sin(y * f4 + a[7]));
      dx += (hash(Math.round(x * 2), Math.round(y * 2), u.id) - 0.5) * rough;
      dy += (hash(Math.round(x * 2) + 7, Math.round(y * 2) + 3, u.id) - 0.5) * rough;
      if (i === 0) path.moveTo(x + dx, y + dy); else path.lineTo(x + dx, y + dy);
    });
    path.closePath();
  }
  ink.save();
  ink.translate(u.x, u.y);
  ink.rotate(u.rot);
  ink.transform(1, 0, -slantK, 1, 0, 0);
  ink.scale(u.sx, u.sy);
  ink.globalAlpha = u.alpha * pen.alpha;
  ink.fill(path);
  if (s.weight > 0) {
    ink.lineWidth = s.weight * (0.6 + 0.8 * hash(s.seed, u.id, 91));
    ink.stroke(path);
  }
  ink.restore();
}

function drawInk(s, units, size, slantK, comp) {
  ink.clearRect(0, 0, W, H);
  ink.font = `${size}px "${s.font}"`;
  ink.textBaseline = "alphabetic";
  ink.fillStyle = s.color; ink.strokeStyle = s.color;
  ink.lineJoin = "round"; ink.lineCap = "round";
  const pen = PENS[s.pen] || PENS["Blue ballpoint"];
  if (pen.shadow) { ink.shadowColor = s.color; ink.shadowBlur = pen.shadow; }
  else { ink.shadowBlur = 0; }
  const otf = otFonts[s.font];
  ink.lineJoin = "round"; ink.lineCap = "round";
  for (const u of units) {
    const sk = slantK + (u.it || 0);
    if (u.kind === "line") { drawLine(s, u, pen); continue; }
    if (u.sym) { drawSymbol(s, u, sk, pen); continue; }
    if (otf && s.warp > 0) { drawWarped(s, otf, u, size, sk, pen); continue; }
    ink.font = `${u.size || size}px "${s.font}"`;
    ink.save();
    ink.translate(u.x, u.y);
    ink.rotate(u.rot);
    ink.transform(1, 0, -sk, 1, 0, 0);
    ink.scale(u.sx, u.sy);
    ink.globalAlpha = u.alpha * pen.alpha;
    ink.fillText(u.t, 0, 0);
    if (s.weight > 0) { ink.lineWidth = s.weight; ink.strokeText(u.t, 0, 0); }
    ink.restore();
  }
  ink.shadowBlur = 0;
  if (s.grain > 0) {
    ink.globalCompositeOperation = "destination-out";
    ink.fillStyle = grainPattern(s.grain, s.seed);
    ink.fillRect(0, 0, W, H);
    ink.globalCompositeOperation = "source-over";
  }
  comp.globalCompositeOperation = "multiply";
  if (s.bleed > 0) {
    comp.filter = `blur(${s.bleed}px)`;
    comp.globalAlpha = 0.5;
    comp.drawImage(inkCanvas, 0, 0);
    comp.filter = "none";
    comp.globalAlpha = 1;
  }
  comp.drawImage(inkCanvas, 0, 0);
  comp.globalCompositeOperation = "source-over";
}

// ---------- scan / photo ----------
// camera looks: every number here is one thing a bad shot gets wrong
const CAM_BASE = { scale: 1, key: 0, keyVar: 0, tilt: 1, jit: 0, bow: 0, desk: ["#5a4938", "#38302a"], pageShadow: 0.5, hand: 0, warm: 0, cool: 0, dim: 0, vig: 0, glare: 0, flash: 0, blur: 0.4, blurVar: 0, soft: 0, grain: 0.1, crease: 0, specks: 0, smudge: 0, streaks: 0, post: "" };
const CAMERA = {
  "Close-up angle": { scale: 1.12, key: 0.07, keyVar: 0.08, tilt: 1.8, jit: 70, bow: 40, hand: 0.5, warm: 0.4, vig: 150, glare: 0.32, blur: 1.6, blurVar: 2.4, soft: 0.6, grain: 0.12, crease: 1, specks: 4, smudge: 1 },
  "Far on desk": { scale: 0.9, key: 0.04, keyVar: 0.07, tilt: 1.8, jit: 30, bow: 40, hand: 0.5, warm: 0.4, vig: 150, glare: 0.32, blur: 1.6, blurVar: 2.4, soft: 0.6, grain: 0.12 },
  "Flash photo": { scale: 1.08, key: 0.05, keyVar: 0.06, tilt: 1.4, jit: 50, bow: 24, desk: ["#2c2a28", "#1a1918"], cool: 0.12, vig: 200, flash: 0.7, blur: 0.8, blurVar: 1.4, soft: 0.4, grain: 0.1, specks: 3, post: "contrast(1.12) saturate(0.9)" },
  "Dim room": { scale: 1.1, key: 0.06, keyVar: 0.08, tilt: 1.8, jit: 60, bow: 40, desk: ["#3b3027", "#241d18"], hand: 0.7, warm: 0.7, vig: 170, glare: 0.1, dim: 0.45, blur: 2.2, blurVar: 2.6, soft: 0.75, grain: 0.34, crease: 1, specks: 3 },
  "Scanner app": { scale: 1.05, key: 0.015, keyVar: 0.02, tilt: 0.5, jit: 20, bow: 8, desk: ["#d9d7d2", "#c8c6c1"], pageShadow: 0.2, blur: 0.4, blurVar: 0.5, soft: 0.2, grain: 0.06, post: "contrast(1.2) brightness(1.07) saturate(0.88)" },
  "Photocopy": { scale: 1.04, key: 0.01, keyVar: 0.02, tilt: 0.4, jit: 16, desk: ["#f4f4f4", "#f4f4f4"], pageShadow: 0, blur: 0.5, soft: 0.3, grain: 0.22, specks: 14, streaks: 1, post: "grayscale(1) contrast(1.6) brightness(1.06)" },
};
const MIX = ["Close-up angle", "Flash photo", "Dim room", "Scanner app", "Close-up angle"];

const noiseTile = (() => {
  const t = document.createElement("canvas"); t.width = t.height = 256;
  const g = t.getContext("2d"); const img = g.createImageData(256, 256);
  let sd = 12345; const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rnd() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0); return t;
})();

function cameraShot(s, src, target, idx, look) {
  const p = { ...CAM_BASE, ...CAMERA[look] };
  const f = s.camFlaw;
  const rnd = k => hash(s.seed, idx, 300 + k);
  const mk = (w = W, h = H) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const STEP = 3;
  // keystone: the phone is not parallel to the page, so the top is narrower
  const k1 = mk(), c1 = k1.getContext("2d");
  const kp = (p.key + rnd(1) * p.keyVar) * f;
  const shiftX = (rnd(3) - 0.5) * 0.05 * f * W;
  for (let y = 0; y < H; y += STEP) {
    const t = y / H, dw = W * (1 - kp * (1 - t));
    c1.drawImage(src, 0, y, W, STEP, (W - dw) / 2 + shiftX * (1 - t), y, dw, STEP + 1);
  }
  // paper bow: edges lift away from the desk
  const k2 = mk(), c2 = k2.getContext("2d");
  const bow = (rnd(4) - 0.3) * p.bow * f;
  if (bow) for (let x = 0; x < W; x += STEP) c2.drawImage(k1, x, 0, STEP, H, x, bow * Math.sin(Math.PI * x / W), STEP + 1, H);
  else c2.drawImage(k1, 0, 0);

  target.width = W; target.height = H;
  const g = target.getContext("2d");
  const desk = g.createLinearGradient(0, 0, W, H);
  desk.addColorStop(0, p.desk[0]); desk.addColorStop(1, p.desk[1]);
  g.fillStyle = desk; g.fillRect(0, 0, W, H);
  g.save();
  g.translate(W / 2 + (rnd(5) - 0.5) * p.jit, H / 2 + (rnd(6) - 0.5) * p.jit);
  g.rotate((rnd(7) - 0.5) * 2 * s.tilt * p.tilt * Math.PI / 180);
  g.scale(p.scale, p.scale);
  if (p.pageShadow) { g.shadowColor = `rgba(0,0,0,${p.pageShadow})`; g.shadowBlur = 36; g.shadowOffsetY = 10; }
  g.drawImage(k2, -W / 2, -H / 2);
  g.restore();

  g.globalCompositeOperation = "multiply";
  // uneven exposure
  const la = rnd(8) * Math.PI * 2, dx = Math.cos(la) * W * 0.8, dy = Math.sin(la) * H * 0.8;
  const lg = g.createLinearGradient(W / 2 - dx, H / 2 - dy, W / 2 + dx, H / 2 + dy);
  const dk = 255 - Math.round(s.shade * 110);
  lg.addColorStop(0, "#fff"); lg.addColorStop(1, `rgb(${dk},${dk},${dk - 6})`);
  g.fillStyle = lg; g.fillRect(0, 0, W, H);
  // soft shadow of the hand or phone
  if (p.hand) {
    const sx = rnd(9) < 0.5 ? 0 : W, sy = rnd(10) * H * 0.5;
    const sh = g.createRadialGradient(sx, sy, 0, sx, sy, W * 0.75);
    sh.addColorStop(0, `rgba(30,25,20,${p.hand * f})`); sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh; g.fillRect(0, 0, W, H);
  }
  if (p.dim) { g.fillStyle = `rgba(70,58,46,${Math.min(0.8, p.dim * (0.5 + f))})`; g.fillRect(0, 0, W, H); }
  // colour cast and lens vignette
  if (p.warm) { g.fillStyle = `rgba(255,238,210,${p.warm})`; g.fillRect(0, 0, W, H); }
  if (p.cool) { g.fillStyle = `rgba(215,228,255,${p.cool})`; g.fillRect(0, 0, W, H); }
  if (p.vig) {
    const v = 255 - Math.round(p.vig * f);
    const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.78);
    vg.addColorStop(0, "#fff"); vg.addColorStop(1, `rgb(${v},${v},${v + 10})`);
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
  }
  // glare from a lamp, or a flash hot spot
  g.globalCompositeOperation = "screen";
  if (p.glare) {
    const gx = W * (0.2 + rnd(11) * 0.6), gy = H * (0.15 + rnd(12) * 0.4);
    const gl = g.createRadialGradient(gx, gy, 0, gx, gy, W * 0.45);
    gl.addColorStop(0, `rgba(255,250,235,${p.glare * f})`); gl.addColorStop(1, "rgba(255,250,235,0)");
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
  }
  if (p.flash) {
    const gx = W * (0.4 + rnd(11) * 0.2), gy = H * (0.35 + rnd(12) * 0.15);
    const gl = g.createRadialGradient(gx, gy, 0, gx, gy, W * 0.55);
    gl.addColorStop(0, `rgba(255,255,255,${Math.min(0.9, p.flash * f * 0.9)})`); gl.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
  }
  g.globalCompositeOperation = "source-over";

  // a few things sitting on the page: crease, specks, smudge, copier streaks
  if (p.crease) {
    const cy = H * (0.3 + rnd(20) * 0.4), sl = (rnd(21) - 0.5) * 40;
    const cg = g.createLinearGradient(0, cy - 14, 0, cy + 14);
    cg.addColorStop(0, "rgba(0,0,0,0)"); cg.addColorStop(0.45, `rgba(60,50,40,${0.12 * f})`);
    cg.addColorStop(0.55, `rgba(255,255,255,${0.16 * f})`); cg.addColorStop(1, "rgba(0,0,0,0)");
    g.save(); g.translate(W / 2, cy); g.rotate(sl / W); g.fillStyle = cg; g.fillRect(-W, -14, W * 2, 28); g.restore();
  }
  for (let i = 0; i < p.specks; i++) {
    const x = rnd(30 + i) * W, y = rnd(40 + i) * H, r = 1.5 + rnd(50 + i) * 3;
    g.fillStyle = `rgba(40,34,30,${0.35 + rnd(60 + i) * 0.3})`;
    g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd(70 + i) * 0.5), rnd(80 + i) * 3, 0, 6.3); g.fill();
  }
  if (p.smudge) {
    const x = W * (0.15 + rnd(90) * 0.7), y = H * (0.2 + rnd(91) * 0.6);
    const sm = g.createRadialGradient(x, y, 0, x, y, 70);
    sm.addColorStop(0, `rgba(90,85,80,${0.22 * f})`); sm.addColorStop(1, "rgba(90,85,80,0)");
    g.fillStyle = sm; g.save(); g.translate(x, y); g.scale(1.8, 0.7); g.translate(-x, -y); g.fillRect(x - 120, y - 120, 240, 240); g.restore();
  }
  if (p.streaks) {
    for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(0,0,0,${0.05 + rnd(100 + i) * 0.07})`; g.fillRect(rnd(110 + i) * W, 0, 2 + rnd(120 + i) * 5, H); }
    const eg = g.createLinearGradient(0, 0, 60, 0); eg.addColorStop(0, "rgba(0,0,0,0.35)"); eg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = eg; g.fillRect(0, 0, 60, H);
    const eg2 = g.createLinearGradient(W, 0, W - 40, 0); eg2.addColorStop(0, "rgba(0,0,0,0.25)"); eg2.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = eg2; g.fillRect(W - 40, 0, 40, H);
  }

  // soft focus on one side
  const blurPx = p.blur + p.blurVar * f;
  if (blurPx > 0.3) {
    const blurred = mk(), bg = blurred.getContext("2d");
    bg.filter = `blur(${blurPx.toFixed(1)}px)`; bg.drawImage(target, 0, 0); bg.filter = "none";
    bg.globalCompositeOperation = "destination-in";
    const fa = rnd(13) * Math.PI * 2;
    const fg = bg.createLinearGradient(W / 2 - Math.cos(fa) * W * 0.5, H / 2 - Math.sin(fa) * H * 0.5, W / 2 + Math.cos(fa) * W * 0.5, H / 2 + Math.sin(fa) * H * 0.5);
    const strong = p.blurVar ? Math.min(1, 0.85 * f) : 0.35;
    fg.addColorStop(0, "rgba(0,0,0,0)"); fg.addColorStop(0.45, "rgba(0,0,0,0.05)"); fg.addColorStop(1, `rgba(0,0,0,${strong})`);
    bg.fillStyle = fg; bg.fillRect(0, 0, W, H);
    g.drawImage(blurred, 0, 0);
  }
  // low resolution phone processing
  if (p.soft) {
    const low = mk(Math.round(W * 0.66), Math.round(H * 0.66)), lg2 = low.getContext("2d");
    lg2.imageSmoothingQuality = "high"; lg2.drawImage(target, 0, 0, low.width, low.height);
    g.globalAlpha = p.soft * Math.min(1, f);
    g.imageSmoothingQuality = "high"; g.drawImage(low, 0, 0, W, H);
    g.globalAlpha = 1;
  }
  // sensor grain
  g.globalCompositeOperation = "overlay";
  g.globalAlpha = Math.min(1, s.noise * 0.5 + p.grain * f);
  g.fillStyle = g.createPattern(noiseTile, "repeat"); g.fillRect(0, 0, W, H);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // colour grading, such as a scanner app's white balance
  if (p.post) {
    const tmp = mk(); tmp.getContext("2d").drawImage(target, 0, 0);
    g.filter = p.post; g.drawImage(tmp, 0, 0); g.filter = "none";
  }
}

function finalize(s, src, target, pageIndex) {
  let look = s.scan === "Bad phone camera" ? "Close-up angle" : s.scan;
  if (look === "Mixed by page") look = MIX[Math.floor(hash(s.seed, pageIndex, 399) * MIX.length)];
  if (CAMERA[look]) { cameraShot(s, src, target, pageIndex, look); return; }
  const g = target.getContext("2d");
  target.width = W; target.height = H;
  g.clearRect(0, 0, W, H);
  if (s.scan === "Clean") { g.drawImage(src, 0, 0); return; }
  const photo = s.scan === "Phone photo";
  const ang = ((hash(s.seed, pageIndex, 77) - 0.5) * 2 * s.tilt) * Math.PI / 180;
  g.fillStyle = photo ? "#3a342d" : "#bdbdbd";
  g.fillRect(0, 0, W, H);
  g.save();
  g.translate(W / 2, H / 2);
  g.rotate(ang);
  const sc = 1.0 + Math.abs(ang) * 1.5 + (photo ? 0.02 : 0.005);
  g.scale(sc, sc);
  g.filter = `blur(${photo ? 0.7 : 0.4}px) contrast(${photo ? 1.04 : 1.02}) brightness(${photo ? 1.0 : 1.01})`;
  g.drawImage(src, -W / 2, -H / 2);
  g.restore();
  g.filter = "none";
  // uneven lighting
  const la = hash(s.seed, pageIndex, 79) * Math.PI * 2;
  const dx = Math.cos(la) * W * 0.7, dy = Math.sin(la) * H * 0.7;
  const grd = g.createLinearGradient(W / 2 - dx, H / 2 - dy, W / 2 + dx, H / 2 + dy);
  const dark = 255 - Math.round(s.shade * (photo ? 70 : 40));
  grd.addColorStop(0, "rgb(255,255,255)");
  grd.addColorStop(1, `rgb(${dark},${dark},${dark - 3})`);
  g.globalCompositeOperation = "multiply";
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  if (photo) {
    g.fillStyle = "rgba(255,244,222,0.32)"; g.fillRect(0, 0, W, H);
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85);
    v.addColorStop(0, "rgba(255,255,255,1)"); v.addColorStop(1, `rgba(${255 - s.shade * 90 | 0},${255 - s.shade * 90 | 0},${255 - s.shade * 90 | 0},1)`);
    g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  g.globalCompositeOperation = "source-over";
  // sensor noise
  if (s.noise > 0) {
    g.globalCompositeOperation = "overlay";
    g.globalAlpha = s.noise * 0.22;
    g.fillStyle = g.createPattern(noiseTile, "repeat");
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  }
}

// ---------- rendering ----------
const pagesEl = document.getElementById("pages");
const countEl = document.getElementById("count");
const comp = document.createElement("canvas"); comp.width = W; comp.height = H;
const compCtx = comp.getContext("2d");
const cleanFirst = document.createElement("canvas"); cleanFirst.width = W; cleanFirst.height = H;
let pageCanvases = [];
let renderQueued = false;
let thumbsDirty = true;

const INK_ORDER = ["box", "quote", "body", "bold", "th", "h2", "head"];
const roleRank = r => r.startsWith("p:") ? 3.5 : INK_ORDER.indexOf(r);
function penNameFor(s, role) {
  if (role.startsWith("p:")) return role.slice(2);
  const pick = { head: s.headPen, h2: s.h2Pen === "Same as heading" ? s.headPen : s.h2Pen, th: s.thPen, quote: s.quotePen, box: s.boxPen, bold: s.boldPen }[role];
  return pick || "Same as body";
}
function drawMark(g, m, color, seed) {
  const j = k => (hash(seed, m.id, 200 + k) - 0.5) * 3;
  g.fillStyle = color; g.globalAlpha = 0.62;
  g.beginPath();
  g.moveTo(m.x + j(1), m.y + j(2));
  g.lineTo(m.x + m.w + j(3), m.y + j(4) - 1);
  g.lineTo(m.x + m.w + j(5) + 2, m.y + m.h + j(6));
  g.lineTo(m.x + j(7) - 2, m.y + m.h + j(8) + 1);
  g.closePath(); g.fill(); g.globalAlpha = 1;
}

function applyZoom() {
  const z = +document.getElementById("zoom").value / 100;
  const avail = Math.max(200, pagesEl.clientWidth - 36);
  const w = Math.min(avail, Math.round(W * z * 0.62)); // 100% = 62% of native, fits a laptop pane
  pageCanvases.forEach(c => { c.style.width = w + "px"; c.style.height = Math.round(w * H / W) + "px"; });
}

function render() {
  renderQueued = false;
  const s = state;
  const meta = fontMeta[s.font];
  if (meta && !fontReady[s.font]) { ensureFont(s.font).then(queueRender); return; }
  const L = layoutText(s);
  while (pageCanvases.length < L.pages.length) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    pagesEl.appendChild(c); pageCanvases.push(c);
  }
  while (pageCanvases.length > L.pages.length) pagesEl.removeChild(pageCanvases.pop());
  const paper = buildPaper(s);
  L.pages.forEach((units, i) => {
    compCtx.globalCompositeOperation = "source-over";
    compCtx.filter = "none";
    compCtx.globalAlpha = 1;
    compCtx.drawImage(paper, 0, 0);
    const marks = units.filter(u => u.kind === "mark");
    if (marks.length) {
      compCtx.globalCompositeOperation = "multiply";
      marks.forEach(m => drawMark(compCtx, m, HILITES[s.hilite] || HILITES.Yellow, s.seed));
      compCtx.globalCompositeOperation = "source-over";
    }
    const inkUnits = units.filter(u => u.kind !== "mark");
    const roles = [...new Set(inkUnits.map(u => u.role || "body"))].sort((a, b) => roleRank(a) - roleRank(b));
    for (const role of roles) {
      const group = inkUnits.filter(u => (u.role || "body") === role);
      const penName = penNameFor(s, role);
      const p = PENS[penName];
      let s2 = p ? { ...s, pen: penName, color: p.color, weight: p.weight, bleed: p.bleed, grain: p.grain } : s;
      if (role === "bold" || role === "th") s2 = { ...s2, weight: Math.max(0.5, s2.weight) * 2.4, bleed: s2.bleed * 1.25 };
      drawInk(s2, group, L.size, L.slantK, compCtx);
    }
    if (i === 0) { const cc = cleanFirst.getContext("2d"); cc.clearRect(0, 0, W, H); cc.drawImage(comp, 0, 0); }
    finalize(s, comp, pageCanvases[i], i);
  });
  countEl.textContent = L.pages.length + (L.pages.length === 1 ? " page" : " pages") + "  ·  A4";
  applyZoom();
  thumbsDirty = true;
  if (typeof scheduleThumbs === "function") scheduleThumbs();
}
function queueRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { if (renderQueued) render(); });
  setTimeout(() => { if (renderQueued) render(); }, 150); // rAF pauses in a hidden pane
}

// ---------- UI ----------
const $ = id => document.getElementById(id);
function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function fmt(c, v) {
  const n = +v;
  const dec = c.step && c.step < 1 ? (String(c.step).split(".")[1] || "").length : 0;
  return n.toFixed(dec) + (c.unit || "");
}
const effPen = v => v === "Same as body" ? state.pen : v === "Same as heading" ? effPen(state.headPen) : v;
const penColor = name => name === state.pen ? state.color : (PENS[name] || PENS[state.pen]).color;

const TABS = [["write", "Write"], ["ink", "Ink"], ["hand", "Hand"], ["paper", "Paper"], ["camera", "Camera"]];
// one stroke icon per tab, 24 unit grid
const TAB_ICONS = {
  write: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><path d="M14 7l3 3"/>',
  ink: '<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/>',
  hand: '<path d="M3 17c2-5 4-9 5.5-8.5S7 15 8.5 15.5 12 8 13.5 8.5 12 15 14 15s3-3 4.5-3 1 3 2.5 3"/>',
  paper: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
  camera: '<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13.5" r="3.2"/>',
};
let activeTab = "write";
function showTab(id) {
  activeTab = id;
  TABS.forEach(([t]) => {
    $("tab-" + t).hidden = t !== id;
    const b = $("tabbtn-" + t); b.setAttribute("aria-selected", t === id ? "true" : "false");
  });
  try { localStorage.setItem("handwriting.tab", id); } catch (e) { /* ignore */ }
  if (id === "camera") scheduleThumbs();
  if (id === "hand") loadCardFonts();
}

function commit(c, v) {
  state[c.id] = v;
  c._set(v);
  if (c.id === "preset") applyPreset(v);
  if (c.id === "pen") applyPen(v);
  if (c.id === "font") applyFontDefaults();
  if (c.type === "pen" || c.id === "preset" || c.id === "color") refreshPens();
  saveState(); queueRender();
}

function addRange(c, host) {
  const wrap = h("div", "ctl");
  const lab = h("label", "", c.label); lab.htmlFor = "c_" + c.id;
  const out = h("output");
  const input = document.createElement("input");
  input.type = "range"; input.id = "c_" + c.id; input.min = c.min; input.max = c.max; input.step = c.step;
  input.addEventListener("input", () => commit(c, +input.value));
  wrap.append(lab, out, input); host.appendChild(wrap);
  c._set = v => { input.value = v; out.textContent = fmt(c, v); };
}
function addColor(c, host) {
  const wrap = h("div", "ctl color");
  const lab = h("label", "", c.label); lab.htmlFor = "c_" + c.id;
  const input = document.createElement("input"); input.type = "color"; input.id = "c_" + c.id;
  input.addEventListener("input", () => commit(c, input.value));
  wrap.append(lab, input); host.appendChild(wrap);
  c._set = v => { input.value = v; };
}
function addSeg(c, host) {
  const wrap = h("div", "ctl seg-wrap"); wrap.appendChild(h("div", "lab", c.label));
  const row = h("div", "seg"); const btns = {};
  c.options.forEach(o => { const b = h("button", "", o); b.type = "button"; b.addEventListener("click", () => commit(c, o)); row.appendChild(b); btns[o] = b; });
  wrap.appendChild(row); host.appendChild(wrap);
  c._set = v => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false"));
}
function addChips(c, host) {
  const wrap = h("div", "ctl"); wrap.appendChild(h("div", "lab", c.label));
  const row = h("div", "chips"); const btns = {};
  c.options.forEach(o => { const b = h("button", "chip", o); b.type = "button"; b.addEventListener("click", () => commit(c, o)); row.appendChild(b); btns[o] = b; });
  wrap.appendChild(row); host.appendChild(wrap);
  c._set = v => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false"));
}
function addFonts(c, host) {
  const wrap = h("div", "ctl"); wrap.appendChild(h("div", "lab", c.label));
  const grid = h("div", "fontgrid"); const btns = {};
  const addOne = name => {
    const m = fontMeta[name];
    const b = h("button", "fcard"); b.type = "button";
    const sample = h("span", "fsample", "Hello, Deepan"); sample.style.fontFamily = `"${name}", cursive`;
    const nm = h("span", "fname", name.replace("Custom: ", "")); if (m && m.joined) nm.appendChild(h("em", "badge", "cursive"));
    b.append(sample, nm); b.addEventListener("click", () => commit(c, name)); grid.appendChild(b); btns[name] = b;
  };
  c.options.forEach(addOne);
  wrap.appendChild(grid); host.appendChild(wrap);
  c._set = v => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false"));
  c._add = name => { addOne(name); };
}
function addPen(c, host) {
  const wrap = h("div", "penrow");
  const head = h("div", "penhead");
  const sample = h("span", "pensample", c.hint && c.hint.startsWith("#") ? "Heading" : "Written text");
  const lab = h("div", "penlab"); lab.append(h("strong", "", c.label), h("small", "", c.hint || ""));
  head.append(lab, sample); wrap.appendChild(head);
  const row = h("div", "swatches"); const btns = {};
  if (c.same) { const b = h("button", "same", c.same); b.type = "button"; b.addEventListener("click", () => commit(c, c.sameVal)); row.appendChild(b); btns[c.sameVal] = b; }
  PEN_ORDER.forEach(n => {
    const b = h("button", "swatch"); b.type = "button"; b.title = n; b.setAttribute("aria-label", n); b.style.setProperty("--sw", PENS[n].color);
    b.addEventListener("click", () => commit(c, n)); row.appendChild(b); btns[n] = b;
  });
  wrap.appendChild(row); host.appendChild(wrap);
  c._set = v => {
    Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false"));
    const eff = effPen(v);
    sample.style.color = penColor(eff);
    sample.style.fontWeight = c.id === "boldPen" || c.id === "thPen" ? "700" : "400";
    sample.title = eff;
  };
}
function addHl(c, host) {
  const wrap = h("div", "penrow");
  const head = h("div", "penhead");
  const lab = h("div", "penlab"); lab.append(h("strong", "", c.label), h("small", "", c.hint));
  const sample = h("span", "pensample", "highlighted"); head.append(lab, sample); wrap.appendChild(head);
  const row = h("div", "swatches"); const btns = {};
  c.options.forEach(n => { const b = h("button", "swatch hl"); b.type = "button"; b.title = n; b.setAttribute("aria-label", n + " highlighter"); b.style.setProperty("--sw", HILITES[n]); b.addEventListener("click", () => commit(c, n)); row.appendChild(b); btns[n] = b; });
  wrap.appendChild(row); host.appendChild(wrap);
  c._set = v => { Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false")); sample.style.setProperty("--hl", HILITES[v] || HILITES.Yellow); };
}
function addLooks(c, host) {
  const wrap = h("div", "ctl"); wrap.appendChild(h("div", "lab", c.label));
  const grid = h("div", "lookgrid"); const btns = {}; c._thumbs = {};
  c.options.forEach(o => {
    const b = h("button", "look"); b.type = "button";
    const cv = document.createElement("canvas"); cv.width = 132; cv.height = 187; cv.className = "thumb";
    b.append(cv, h("span", "lname", o)); b.addEventListener("click", () => commit(c, o)); grid.appendChild(b); btns[o] = b; c._thumbs[o] = cv;
  });
  wrap.appendChild(grid); host.appendChild(wrap);
  c._set = v => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", k === v ? "true" : "false"));
}

function buildControls() {
  const hosts = { hand: $("tab-hand"), ink: $("tab-ink"), paper: $("tab-paper"), camera: $("tab-camera") };
  const folds = {};
  const builders = { range: addRange, color: addColor, seg: addSeg, chips: addChips, fonts: addFonts, pen: addPen, hl: addHl, looks: addLooks };
  CONTROLS.forEach(c => {
    let host = hosts[c.tab];
    if (c.fold) {
      const key = c.tab + c.fold;
      if (!folds[key]) {
        const d = h("details", "fold"); d.appendChild(h("summary", "", c.fold));
        const body = h("div", "foldbody"); d.appendChild(body); host.appendChild(d); folds[key] = body;
      }
      host = folds[key];
    }
    builders[c.type](c, host);
  });
}

function refreshPens() { CONTROLS.forEach(c => { if (c.type === "pen") c._set(state[c.id]); }); }
function syncControls() {
  CONTROLS.forEach(c => c._set(state[c.id]));
  $("text").value = state.text;
  $("seed").value = state.seed;
}
function setCtl(id, v) {
  state[id] = v;
  const c = CONTROLS.find(x => x.id === id);
  c._set(v);
}

function applyPreset(name) {
  const p = PRESETS[name]; if (!p) return;
  for (const k in p) setCtl(k, p[k]);
  setCtl("preset", name);
  applyPen(state.pen);
  refreshPens();
}
function applyPen(name) {
  const p = PENS[name]; if (!p) return;
  setCtl("color", p.color); setCtl("weight", p.weight); setCtl("bleed", p.bleed); setCtl("grain", p.grain);
}
function applyFontDefaults() {
  const m = fontMeta[state.font];
  if (m && m.joined) setCtl("letterVar", Math.min(state.letterVar, 1));
}

// camera thumbnails: your own first page, shot with each look
let thumbTimer = null, thumbRun = 0;
function scheduleThumbs() {
  if (activeTab !== "camera" || !thumbsDirty) return;
  clearTimeout(thumbTimer);
  thumbTimer = setTimeout(runThumbs, 450);
}
function runThumbs() {
  const c = CONTROLS.find(x => x.id === "scan");
  const run = ++thumbRun; thumbsDirty = false;
  const tmp = document.createElement("canvas");
  const names = c.options.slice();
  const step = () => {
    if (run !== thumbRun) return;
    const name = names.shift(); if (!name) return;
    finalize({ ...state, scan: name }, cleanFirst, tmp, 0);
    const cv = c._thumbs[name], g = cv.getContext("2d");
    g.clearRect(0, 0, cv.width, cv.height); g.drawImage(tmp, 0, 0, cv.width, cv.height);
    setTimeout(step, 20);
  };
  step();
}

// ---------- markdown toolbar ----------
function editorEdit(fn) {
  const ta = $("text");
  fn(ta);
  ta.focus();
  ta.dispatchEvent(new Event("input"));
}
function wrapSel(before, after, ph) {
  editorEdit(ta => {
    const a = ta.selectionStart, b = ta.selectionEnd, sel = ta.value.slice(a, b) || ph;
    ta.setRangeText(before + sel + after, a, b, "end");
    ta.setSelectionRange(a + before.length, a + before.length + sel.length);
  });
}
function prefixLines(p) {
  editorEdit(ta => {
    const v = ta.value;
    const a = v.lastIndexOf("\n", ta.selectionStart - 1) + 1;
    let b = v.indexOf("\n", ta.selectionEnd); if (b < 0) b = v.length;
    const block = v.slice(a, b).split("\n");
    const allHave = block.every(l => l.startsWith(p));
    const out = block.map(l => allHave ? l.slice(p.length) : p + l.replace(p.startsWith("#") ? /^#{1,3}\s+/ : /^$/, "")).join("\n");
    ta.setRangeText(out, a, b, "select");
  });
}
function insertBlock(t) {
  editorEdit(ta => {
    const a = ta.selectionStart, v = ta.value;
    const pre = a > 0 && v[a - 1] !== "\n" ? "\n" : "";
    ta.setRangeText(pre + t + "\n", a, ta.selectionEnd, "end");
  });
}
const TOOLS = [
  ["H1", "Heading: # text", () => prefixLines("# ")],
  ["H2", "Subheading: ## text", () => prefixLines("## ")],
  null,
  ["B", "Bold: **text**", () => wrapSel("**", "**", "bold"), "b"],
  ["I", "Italic: *text*", () => wrapSel("*", "*", "italic"), "i"],
  ["Mark", "Highlight: ==text==", () => wrapSel("==", "==", "highlight")],
  ["U", "Underline: __text__", () => wrapSel("__", "__", "underline"), "u"],
  ["S", "Strike: ~~text~~", () => wrapSel("~~", "~~", "strike")],
  null,
  ["List", "Bullets", () => prefixLines("- ")],
  ["1.", "Numbered list", () => prefixLines("1. ")],
  ["To-do", "Checkbox list", () => prefixLines("- [ ] ")],
  ["Quote", "Quote", () => prefixLines("> ")],
  null,
  ["Table", "Insert a table", () => insertBlock("| Term | Meaning |\n|---|---|\n| first | what it is |\n| second | what it is |")],
  ["Line", "Hand drawn line", () => insertBlock("---")],
  ["Page", "Start a new page", () => insertBlock("\\newpage")],
];
const TOOL_COLORS = [["blue", "Blue pen"], ["black", "Black pen"], ["red", "Red pen"], ["green", "Green pen"], ["purple", "Purple pen"], ["pencil", "Pencil"]];
const SYNTAX = [
  ["# Heading", "big, underlined, heading pen"],
  ["## Subheading", "heading pen, no underline"],
  ["**bold**", "pressed harder"],
  ["*italic*", "leans over"],
  ["==mark==", "highlighter"],
  ["__under__  ~~strike~~", "line under, line through"],
  ["{red}text{/}", "any pen colour: red blue black green purple pencil gel"],
  ["`note`", "pencil"],
  ["- item   1. item", "lists, indent two spaces to nest"],
  ["- [ ] to do   - [x] done", "boxes"],
  ["> quote", "pencil with a bar"],
  ["| a | b |  then  |---|---|", "table, the row above |---| is the header"],
  ["---", "hand drawn line"],
  ["\\newpage", "start a new page"],
];
function buildWriteTab() {
  const tb = $("toolbar");
  TOOLS.forEach(t => {
    if (!t) { tb.appendChild(h("span", "sep")); return; }
    const b = h("button", "tool", t[0]); b.type = "button"; b.title = t[1];
    if (t[0] === "B") b.classList.add("is-b"); if (t[0] === "I") b.classList.add("is-i");
    b.addEventListener("mousedown", e => e.preventDefault());
    b.addEventListener("click", t[2]); tb.appendChild(b);
  });
  const cb = $("colors"); cb.appendChild(h("span", "lab", "Colour selection"));
  TOOL_COLORS.forEach(([k, name]) => {
    const b = h("button", "swatch"); b.type = "button"; b.title = name; b.setAttribute("aria-label", name);
    b.style.setProperty("--sw", PENS[COLOR_TAGS[k]].color);
    b.addEventListener("mousedown", e => e.preventDefault());
    b.addEventListener("click", () => wrapSel("{" + k + "}", "{/}", "text")); cb.appendChild(b);
  });
  const sx = $("syntax");
  SYNTAX.forEach(([a, b]) => { const r = h("div", "srow"); r.append(h("code", "", a), h("span", "", b)); sx.appendChild(r); });
  $("text").addEventListener("keydown", e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const t = TOOLS.find(x => x && x[3] === e.key.toLowerCase());
    if (t) { e.preventDefault(); t[2](); }
  });
}

// ---------- export ----------
function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const toBlob = (c, type, q) => new Promise(r => c.toBlob(r, type, q));

async function exportPng() {
  for (let i = 0; i < pageCanvases.length; i++) {
    download(await toBlob(pageCanvases[i], "image/png"), `handwriting-${i + 1}.png`);
    await new Promise(r => setTimeout(r, 250));
  }
}

async function exportPdf() {
  const enc = new TextEncoder();
  const parts = []; let offset = 0; const offsets = [];
  const push = b => { const u = typeof b === "string" ? enc.encode(b) : b; parts.push(u); offset += u.length; };
  const n = pageCanvases.length;
  const jpgs = [];
  for (const c of pageCanvases) jpgs.push(new Uint8Array(await (await toBlob(c, "image/jpeg", 0.93)).arrayBuffer()));
  const obj = (id, body) => { offsets[id] = offset; push(`${id} 0 obj\n`); push(body); push("\nendobj\n"); };
  push("%PDF-1.4\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  const kids = Array.from({ length: n }, (_, i) => `${3 + i * 3} 0 R`).join(" ");
  obj(2, `<< /Type /Pages /Kids [${kids}] /Count ${n} >>`);
  for (let i = 0; i < n; i++) {
    const p = 3 + i * 3, ct = p + 1, im = p + 2;
    obj(p, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${ct} 0 R >>`);
    const content = "q 595.28 0 0 841.89 0 0 cm /Im0 Do Q";
    obj(ct, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    offsets[im] = offset;
    push(`${im} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpgs[i].length} >>\nstream\n`);
    push(jpgs[i]); push("\nendstream\nendobj\n");
  }
  const total = 3 + n * 3;
  const xref = offset;
  push(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for (let i = 1; i < total; i++) push(String(offsets[i]).padStart(10, "0") + " 00000 n \n");
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  download(new Blob(parts, { type: "application/pdf" }), "handwriting.pdf");
}

// ---------- custom font ----------
async function loadCustomFont(file) {
  const name = "Custom: " + file.name.replace(/\.[^.]+$/, "");
  const ff = new FontFace(name, await file.arrayBuffer());
  await ff.load(); document.fonts.add(ff);
  loadedFonts.add(name);
  fontReady[name] = true;
  fontMeta[name] = { scale: 1, joined: false };
  const c = CONTROLS.find(x => x.id === "font");
  c.options.push(name); c._add(name);
  commit(c, name);
}

// ---------- boot ----------
async function boot() {
  loadState();
  const nav = $("tabs");
  TABS.forEach(([id, label]) => {
    const b = h("button", "tabbtn"); b.type = "button"; b.id = "tabbtn-" + id; b.setAttribute("role", "tab");
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${TAB_ICONS[id]}</svg>`;
    b.appendChild(h("span", "tablabel", label));
    b.addEventListener("click", () => showTab(id)); nav.appendChild(b);
  });
  buildWriteTab();
  buildControls();
  const fontHost = $("tab-hand");
  const fl = h("label", "filebtn", "Use your own font (.ttf .otf .woff2)");
  const fi = document.createElement("input"); fi.type = "file"; fi.id = "fontFile"; fi.accept = ".ttf,.otf,.woff,.woff2";
  fi.addEventListener("change", e => { if (e.target.files[0]) loadCustomFont(e.target.files[0]); });
  fl.appendChild(fi); fontHost.appendChild(fl);
  syncControls();
  let saved = "write"; try { saved = localStorage.getItem("handwriting.tab") || "write"; } catch (e) { /* ignore */ }
  showTab(TABS.some(t => t[0] === saved) ? saved : "write");
  const ta = $("text");
  ta.addEventListener("input", () => { state.text = ta.value; saveState(); queueRender(); });
  $("btnSample").onclick = () => { state.text = SAMPLE; ta.value = SAMPLE; saveState(); queueRender(); };
  $("btnClear").onclick = () => { state.text = ""; ta.value = ""; saveState(); queueRender(); };
  $("openFile").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    state.text = await f.text(); ta.value = state.text; saveState(); queueRender(); e.target.value = "";
  });
  const seedEl = $("seed");
  seedEl.addEventListener("input", () => { state.seed = Math.max(0, parseInt(seedEl.value || "0", 10)); saveState(); queueRender(); });
  $("btnShuffle").onclick = () => { state.seed = Math.floor(Math.random() * 100000); seedEl.value = state.seed; saveState(); queueRender(); };
  $("zoom").addEventListener("input", applyZoom);
  $("btnPng").onclick = exportPng;
  $("btnPdf").onclick = exportPdf;
  window.addEventListener("resize", applyZoom);
  if (!fontMeta[state.font]) state.font = FONTS[0][0];
  ensureFont("Reenie Beanie", false);
  await ensureFont(state.font);
  render();
  setTimeout(loadCardFonts, 2500);
  window.__hw = { state, render, syncControls, setCtl, commit };
}
boot();
