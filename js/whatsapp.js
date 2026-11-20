// Checkout: saves the order, creates the tee's pages (scan + private edit link),
// then hands the customer a WhatsApp button with everything pre-filled.
// Your WhatsApp number and site address live in js/site-config.js.

const overlay = document.getElementById("order-overlay");
const form = document.getElementById("order-form");
const itemField = document.getElementById("order-item");
const successView = document.getElementById("order-success");
const closeBtns = document.querySelectorAll("[data-close-modal]");
let currentSlogan = "";

function openOrderModal(itemName, itemPrice, slogan) {
  itemField.value = itemName;
  form.dataset.price = itemPrice || "";
  currentSlogan = slogan || "";
  form.style.display = "block";
  successView.style.display = "none";
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
    openOrderModal(btn.dataset.orderItem, btn.dataset.orderPrice, btn.dataset.orderSlogan);
  });
});

function generateOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LT-${n}`;
}

function saveOrder(order) {
  // Local copy first, so tracking still works on this phone if the network call fails.
  const existing = JSON.parse(localStorage.getItem("lt_orders") || "[]");
  existing.push(order);
  localStorage.setItem("lt_orders", JSON.stringify(existing));

  if (backendConfigured) {
    sb.from("orders").insert({
      id: order.id,
      item: order.item,
      name: order.name,
      phone: order.phone,
      address: order.address,
      status: "placed",
    }).then(({ error }) => {
      if (error) console.error("Order save failed:", error);
    });
  }
}

document.getElementById("os-copy").addEventListener("click", () => {
  const input = document.getElementById("os-edit");
  input.select();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(input.value);
  else document.execCommand("copy");
  const btn = document.getElementById("os-copy");
  btn.textContent = "Copied";
  setTimeout(() => (btn.textContent = "Copy"), 1500);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("order-name").value.trim();
  const address = document.getElementById("order-address").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const item = itemField.value;
  const price = form.dataset.price;
  const finish = (document.querySelector('input[name="finish"]:checked') || {}).value || "Embroidery";

  if (!name || !address || !phone) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Setting things up...";

  const orderId = generateOrderId();
  saveOrder({
    id: orderId,
    item: `${item} (${finish})`,
    name,
    address,
    phone,
    status: "placed",
    createdAt: new Date().toISOString(),
  });

  // Create this tee's pages. If it fails, the order can still go out on WhatsApp.
  let tee = null;
  if (backendConfigured) {
    try {
      const { data, error } = await sb.rpc("create_tee", { p_order_id: orderId, p_slogan: currentSlogan });
      if (!error && data && data.scan_code) tee = data;
      else console.error("create_tee failed:", error);
    } catch (err) {
      console.error("create_tee failed:", err);
    }
  }

  const lines = [
    `Hello ${BRAND} Team! 👋`,
    "",
    "I would like to place an order:",
    "",
    `📦 Order ID: #${orderId}`,
    `👕 Item: ${item}`,
    `🧵 Finish: ${finish}`,
    currentSlogan ? `💬 Slogan: "${currentSlogan}"` : null,
    price ? `💰 Price: ${price}` : null,
    `📍 Delivery: ${address}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
  ];
  if (tee) {
    lines.push(
      "",
      `🔗 Scan page: ${scanUrl(tee.scan_code)}`,
      `🔑 Edit link (private): ${editUrl(tee.edit_key)}`,
      `🔳 QR for printing: ${qrPageUrl(tee.scan_code)}`
    );
  }
  const message = encodeURIComponent(lines.filter((l) => l !== null).join("\n"));
  const waUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`;

  document.getElementById("os-id").textContent = `#${orderId}`;
  document.getElementById("os-wa").href = waUrl;
  const editStep = document.getElementById("os-edit-step");
  if (tee) {
    document.getElementById("os-sub").textContent = "Your page is ready to set up. Two quick steps:";
    document.getElementById("os-edit").value = editUrl(tee.edit_key);
    document.getElementById("os-open").href = editUrl(tee.edit_key);
    editStep.style.display = "block";
  } else {
    document.getElementById("os-sub").textContent =
      "We couldn't create your page automatically. Send the order anyway and we'll set it up for you.";
    editStep.style.display = "none";
  }

  form.style.display = "none";
  successView.style.display = "block";
  submitBtn.disabled = false;
  submitBtn.textContent = "Confirm & continue";
  form.reset();
});
