// blog-starter — Générateur de thème : 1 accent (hex) -> set de tokens CSS complet.
// Usage : node gen-theme.mjs <#hex> [dark|light] [nom]
//   ex : node gen-theme.mjs "#7c5cff" dark my-brand  > templates/themes/my-brand.css

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}
function hslToHex(h, s, l) {
  s = clamp(s) / 100; l = clamp(l) / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}
function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
const rgba = ({ r, g, b }, a) => `rgba(${r},${g},${b},${a})`;

const accentHex = process.argv[2] || '#03A9F4';
const mode = (process.argv[3] || 'dark').toLowerCase();
const name = process.argv[4] || 'custom';
const rgb = hexToRgb(accentHex);
const { h, s } = rgbToHsl(rgb);
const light = mode === 'light';

const accent = accentHex;
const accentBright = hslToHex(h, s, clamp(rgbToHsl(rgb).l + 14, 0, 92));
const accentDeep = hslToHex(h, clamp(s + 6), clamp(rgbToHsl(rgb).l - 20, 20));
const onAccent = luminance(rgb) > 0.5 ? '#0a0b0f' : '#ffffff';

// surfaces/texte dérivés de la teinte de l'accent (légèrement teintés)
const S = light
  ? { bg: [h, 30, 97], elev: [h, 40, 99], s1: [h, 0, 100], s2: [h, 22, 95], s3: [h, 20, 90],
      bd: [h, 22, 87], bds: [h, 20, 78], t: [h, 15, 10], ts: [h, 10, 30], tf: [h, 8, 48], td: [h, 8, 62] }
  : { bg: [h, 20, 4.5], elev: [h, 18, 6.5], s1: [h, 16, 8.5], s2: [h, 15, 11.5], s3: [h, 14, 16],
      bd: [h, 18, 22], bds: [h, 16, 32], t: [h, 14, 96], ts: [h, 11, 72], tf: [h, 9, 50], td: [h, 9, 33] };
const H = (a) => hslToHex(a[0], a[1], a[2]);

const out = `/* THÈME · ${name} — généré depuis l'accent ${accent} (mode ${mode}) */
:root {
  --bg:${H(S.bg)}; --bg-elev:${H(S.elev)}; --surface-1:${H(S.s1)}; --surface-2:${H(S.s2)}; --surface-3:${H(S.s3)};
  --border:${H(S.bd)}; --border-strong:${H(S.bds)}; --grid-line:${rgba(rgb, 0.035)};
  --text:${H(S.t)}; --text-soft:${H(S.ts)}; --text-faint:${H(S.tf)}; --text-dim:${H(S.td)};
  --accent:${accent}; --accent-bright:${accentBright}; --accent-deep:${accentDeep};
  --accent-tint:${rgba(rgb, 0.11)}; --accent-line:${rgba(rgb, 0.28)}; --accent-glow:${rgba(rgb, 0.3)};
  --grad-accent:linear-gradient(120deg,${accentBright},${accent} 55%,${accentDeep});
  --on-accent:${onAccent};
  --success:#34d399; --success-tint:rgba(52,211,153,.13);
  --warning:#ffb020; --warning-tint:rgba(255,176,32,.13);
  --danger:#ff4d6d;  --danger-tint:rgba(255,77,109,.13);
  --info:#38bdf8;    --info-tint:rgba(56,189,248,.13);
  --font-display:"Chakra Petch",system-ui,sans-serif;
  --font-sans:"Inter",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",monospace;
  --notch:${light ? 4 : 12}px;
}
`;
process.stdout.write(out);
