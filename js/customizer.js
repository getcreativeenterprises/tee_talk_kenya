const state = {
  garment: "tee",
  color: "#F3EFE6",
  text: "TELL ME 2 TRUTHS AND A LIE.",
  textColor: "#1A1A1A",
  font: "mono",
  qrOn: false,
  qrDest: "Dogs vs Cats Community Poll",
};

const fontFamilies = {
  mono: "'Space Mono', monospace",
  script: "'Caveat', cursive",
  grotesk: "'Space Grotesk', sans-serif",
};

const garmentPaths = {
  tee: "M60 10 L20 40 L35 70 L55 58 L55 220 L145 220 L145 58 L165 70 L180 40 L140 10 L120 22 C110 30 90 30 80 22 Z",
  cap: "M40 90 C40 40 160 40 160 90 L170 100 L165 108 L30 108 L25 100 Z",
};

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
  document.getElementById("cz-garment").setAttribute("d", garmentPaths[state.garment]);
  document.getElementById("cz-garment").setAttribute("fill", state.color);

  const stroke = state.color === "#1A1A1A" ? "#E6E0D4" : "#1A1A1A";
  document.getElementById("cz-garment").setAttribute("stroke", stroke);

  const lines = wrapText(state.text);
  const lineEls = [document.getElementById("cz-line1"), document.getElementById("cz-line2"), document.getElementById("cz-line3")];
  const startY = state.garment === "cap" ? 75 : 140 - (lines.length - 1) * 7;

  lineEls.forEach((el, i) => {
    if (lines[i]) {
      el.textContent = lines[i];
      el.setAttribute("y", startY + i * 15);
      el.setAttribute("fill", state.textColor);
      el.setAttribute("font-family", fontFamilies[state.font]);
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  document.getElementById("cz-qr-tag").style.display = state.qrOn ? "block" : "none";
}

document.querySelectorAll("[data-garment]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-garment]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.garment = btn.dataset.garment;
    render();
  });
});

document.querySelectorAll("[data-color]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll(".swatch").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.color = btn.dataset.color;
    render();
  });
});

document.querySelectorAll("[data-textcolor]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll(".swatch").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.textColor = btn.dataset.textcolor;
    render();
  });
});

document.querySelectorAll(".font-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".font-option").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.font = btn.dataset.font;
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
const qrDestSelect = document.getElementById("qr-dest");
qrToggle.addEventListener("click", () => {
  state.qrOn = !state.qrOn;
  qrToggle.classList.toggle("on", state.qrOn);
  qrDestSelect.style.display = state.qrOn ? "block" : "none";
  render();
});
qrDestSelect.addEventListener("change", () => {
  state.qrDest = qrDestSelect.value;
});

document.getElementById("cz-order").addEventListener("click", () => {
  const garmentLabel = state.garment === "tee" ? "Custom T-Shirt" : "Custom Cap";
  const summary = `${garmentLabel} | Text: "${state.text}" | Color: ${state.color} | Font: ${state.font}` +
    (state.qrOn ? ` | QR: ${state.qrDest}` : "");
  openOrderModal(summary, "");
});

render();
