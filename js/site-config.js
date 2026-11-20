// ---- EDIT THESE TWO LINES ONCE. After that, do NOT overwrite this file when you update the site. ----
const STORE_WHATSAPP_NUMBER = "254740771555";            // your number: digits only, with country code, no +
const SITE_URL = "https://tee-talk-kenya.glowkeneon.workers.dev";    // your live site, no trailing slash
// -----------------------------------------------------------------------------------------------------

const scanUrl = (code) => `${SITE_URL}/t.html?c=${code}`;
const editUrl = (key) => `${SITE_URL}/edit.html?k=${key}`;
const qrPageUrl = (code) => `${SITE_URL}/qr.html?c=${code}`;
