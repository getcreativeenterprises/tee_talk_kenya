// Things that change often live in THIS file, so updates are one small upload.
// Edit the lists below on GitHub (pencil icon), commit, done.

const BRAND = "Tee Talk";

// Shirt colors shown in the customizer dropdown. name = what you see on orders.
const BASE_COLORS = [
  { name: "White",      hex: "#FFFFFF" },
  { name: "Black",      hex: "#1A1A1A" },
  { name: "Red",        hex: "#B5342B" },
  { name: "Pink",       hex: "#F2B5C4" },
  { name: "Green",      hex: "#3F7550" },
  { name: "Light Blue", hex: "#A8C8E6" },
];

// Text / thread / print colors.
const TEXT_COLORS = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#F3EBDD" },
  { name: "Red",   hex: "#B5342B" },
  { name: "Green", hex: "#2F5D3A" },
  { name: "Navy",  hex: "#1F3A5F" },
];

const FONTS = [
  { key: "mono",    name: "Typewriter",    css: "'Space Mono', monospace" },
  { key: "script",  name: "Calligraphic",  css: "'Caveat', cursive" },
  { key: "grotesk", name: "Clean Grotesk", css: "'Space Grotesk', sans-serif" },
];

// Shop items. PLACEHOLDER PRICES: change them here.
// slogan = the text printed on the shirt (also shown at the top of its scan page).
const PRODUCTS = [
  { name: "The Warning",    slogan: "ASK ME WHAT I DID LAST TUESDAY.",    price: "KSh 1,800" },
  { name: "The Conspiracy", slogan: "I HAVE A THEORY. YOU WON'T LIKE IT.", price: "KSh 1,800" },
  { name: "The Bracket",    slogan: "DOGS OR CATS? CONVINCE ME.",          price: "KSh 1,900" },
  { name: "The Icebreaker", slogan: "ASK ME ABOUT MY WORST FIRST DATE.",   price: "KSh 1,900" },
  { name: "The Timer",      slogan: "YOU HAVE 5 MINUTES TO CHANGE MY MIND.", price: "KSh 2,000" },
];
