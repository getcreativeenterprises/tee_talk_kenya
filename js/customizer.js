// Live garment preview. Colors, fonts and defaults come from js/shop-config.js.
const state = {
  garment: "tee",
  base: BASE_COLORS[0].name,
  textColor: TEXT_COLORS[0].name,
  font: FONTS[0].key,
  text: "DOGS OR CATS? CONVINCE ME.",
  qrOn: true,
};

const garmentPaths = {
  tee: "M60 10 L20 40 L35 70 L55 58 L55 220 L145 220 L145 58 L165 70 L180 40 L140 10 L120 22 C110 30 90 30 80 22 Z",
  cap: "M40 90 C40 40 160 40 160 90 L170 100 L165 108 L30 108 L25 100 Z",
};

const byName = (list, name) => list.find((c) => c.name === name) || list[0];
const fontByKey = (key) => FONTS.find((f) => f.key === key) || FONTS[0];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function wrapText(text, maxCharsPerLine = 14) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function render() {
  const base = byName(BASE_COLORS, state.base);
  const ink = byName(TEXT_COLORS, state.textColor);
  const garment = document.getElementById("cz-garment");
  garment.setAttribute("d", garmentPaths[state.garment]);
  garment.setAttribute("fill", base.hex);
  garment.setAttribute("stroke", luminance(base.hex) < 0.2 ? "#E6E0D4" : "#1A1A1A");

  const lines = wrapText(state.text);
  const startY = state.garment === "cap" ? 75 : 140 - (lines.length - 1) * 7;
  [1, 2, 3].forEach((n, i) => {
    const el = document.getElementById("cz-line" + n);
    if (lines[i]) {
      el.textContent = lines[i];
      el.setAttribute("y", startY + i * 15);
      el.setAttribute("fill", ink.hex);
      el.setAttribute("font-family", fontByKey(state.font).css);
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  document.getElementById("base-chip").style.background = base.hex;
  document.getElementById("text-chip").style.background = ink.hex;
  document.getElementById("cz-warn").style.display = contrast(base.hex, ink.hex) < 3 ? "block" : "none";
  document.getElementById("cz-qr-tag").style.display = state.qrOn ? "block" : "none";
}

function fillSelect(id, list, selected) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  list.forEach((c) => {
    const o = document.createElement("option");
    o.value = o.textContent = c.name;
    if (c.name === selected) o.selected = true;
    sel.appendChild(o);
  });
  return sel;
}

fillSelect("cz-base", BASE_COLORS, state.base).addEventListener("change", (e) => { state.base = e.target.value; render(); });
fillSelect("cz-textcolor", TEXT_COLORS, state.textColor).addEventListener("change", (e) => { state.textColor = e.target.value; render(); });

const fontBox = document.getElementById("font-options");
FONTS.forEach((f) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "font-option" + (f.key === state.font ? " active" : "");
  b.textContent = f.name;
  b.style.fontFamily = f.css;
  b.addEventListener("click", () => {
    fontBox.querySelectorAll(".font-option").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    state.font = f.key;
    render();
  });
  fontBox.appendChild(b);
});

document.querySelectorAll("[data-garment]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-garment]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.garment = btn.dataset.garment;
    render();
  });
});

const textInput = document.getElementById("cz-text");
const countEl = document.getElementById("cz-count");
textInput.addEventListener("input", () => {
  state.text = textInput.value.toUpperCase();
  countEl.textContent = textInput.value.length;
  render();
});

const qrToggle = document.getElementById("qr-toggle");
qrToggle.addEventListener("click", () => {
  state.qrOn = !state.qrOn;
  qrToggle.classList.toggle("on", state.qrOn);
  render();
});

document.getElementById("cz-order").addEventListener("click", () => {
  const garmentLabel = state.garment === "tee" ? "Custom T-Shirt" : "Custom Cap";
  const summary = `${garmentLabel} | Shirt color: ${state.base} | Text: "${state.text}"` +
    ` | Text color: ${state.textColor} | Font: ${fontByKey(state.font).name}` +
    ` | QR on back: ${state.qrOn ? "Yes" : "No"}`;
  openOrderModal(summary, "", state.text);
});

textInput.value = state.text;
countEl.textContent = state.text.length;
render();
