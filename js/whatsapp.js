// ---- CONFIGURE THIS ----
const STORE_WHATSAPP_NUMBER = "254700000000"; // replace with your number, no + or spaces
// -------------------------

const overlay = document.getElementById("order-overlay");
const form = document.getElementById("order-form");
const itemField = document.getElementById("order-item");
const closeBtns = document.querySelectorAll("[data-close-modal]");

function openOrderModal(itemName, itemPrice) {
  itemField.value = itemName;
  form.dataset.price = itemPrice || "";
  overlay.classList.add("open");
}

function closeOrderModal() {
  overlay.classList.remove("open");
}

closeBtns.forEach((btn) => btn.addEventListener("click", closeOrderModal));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeOrderModal();
});

document.querySelectorAll("[data-order-item]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openOrderModal(btn.dataset.orderItem, btn.dataset.orderPrice);
  });
});

function generateOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LT-${n}`;
}

function saveOrder(order) {
  const existing = JSON.parse(localStorage.getItem("lt_orders") || "[]");
  existing.push(order);
  localStorage.setItem("lt_orders", JSON.stringify(existing));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("order-name").value.trim();
  const address = document.getElementById("order-address").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const item = itemField.value;
  const price = form.dataset.price;

  if (!name || !address || !phone) return;

  const orderId = generateOrderId();

  const lines = [
    "Hello LET'S TALK Team! 👋",
    "",
    "I would like to place an order:",
    "",
    `📦 Order ID: #${orderId}`,
    `👕 Item: ${item}`,
    price ? `💰 Price: ${price}` : null,
    `📍 Delivery: ${address}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n"));
  const waUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`;

  saveOrder({
    id: orderId,
    item,
    name,
    address,
    phone,
    status: "placed",
    createdAt: new Date().toISOString(),
  });

  window.open(waUrl, "_blank");
  closeOrderModal();
  form.reset();
});
