console.log("Content script loaded");
// 🤖 Simple AI-like product understanding (pattern-based)
function getProductCategory(text) {
  if (text.match(/shirt|t-shirt|jeans|dress|jacket/)) return "fashion";
  if (text.match(/soap|shampoo|cream|cosmetic|skincare/)) return "cosmetics";
  if (text.match(/phone|laptop|tv|earphones|charger/)) return "electronics";
  if (text.match(/food|oil|snack|biscuit|chocolate/)) return "food";
  return "general";
}

// 🌿 Suggest better alternatives
function getEcoAlternatives(category) {
  const alternatives = {
    fashion: "Try: organic cotton, recycled fabrics, slow fashion brands",
    cosmetics: "Try: paraben-free, sulfate-free, cruelty-free products",
    electronics: "Try: refurbished devices or energy-efficient models",
    food: "Try: organic, locally sourced, palm-oil-free products",
    general: "Try: eco-certified, sustainable alternatives"
  };

  return alternatives[category];
}
// 🛒 Detect if page is a product page (works on most sites)
function isProductPage() {
  const keywords = ["add to cart", "buy now", "product details", "price", "mrp"];
  const text = document.body.innerText.toLowerCase();

  return keywords.some(word => text.includes(word));
}

// 🌱 Analyze sustainability
function analyzeSustainability(console.log("Scanning page...");) {
  const text = document.body.innerText.toLowerCase();

  let warnings = [];
  let score = 10; // start from best score

  // 🌴 Palm oil
  if (text.match(/palm oil|palmolein|vegetable oil/)) {
    warnings.push("🌴 Palm oil detected → deforestation risk");
    score -= 2;
  }

  // 👕 Fast fashion
  if (text.match(/polyester|nylon|acrylic|fast fashion/)) {
    warnings.push("👕 Synthetic fabric → pollution & microplastics");
    score -= 2;
  }

  // 🐄 Animal materials
  if (text.match(/leather|fur|suede|wool/)) {
    warnings.push("🐄 Animal-based material → high impact");
    score -= 2;
  }

  // 🧴 Chemicals
  if (text.match(/paraben|sulfate|silicone/)) {
    warnings.push("🧴 Harmful chemicals detected");
    score -= 1;
  }

  // 📦 Plastic
  if (text.match(/plastic|single-use/)) {
    warnings.push("📦 Plastic usage → waste issue");
    score -= 1;
  }

  // ⚡ Electronics
  if (text.match(/laptop|phone|battery|tv|charger/)) {
    warnings.push("⚡ Electronics → high carbon footprint");
    score -= 2;
  }

  // Clamp score
  if (score < 1) score = 1;

  if (warnings.length > 0) {
    const category = getProductCategory(text);
const suggestion = getEcoAlternatives(category);
showPopup(warnings, score, suggestion);
  }
}

// 🎯 UI with sustainability score
function showPopup(warnings, score) {
  if (document.getElementById("eco-popup")) return;

  const box = document.createElement("div");
  box.id = "eco-popup";

  // Color based on score
  let color = score >= 7 ? "#4CAF50" : score >= 4 ? "#FFC107" : "#F44336";

  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.right = "20px";
  box.style.background = "#1b1b1b";
  box.style.color = "#fff";
  box.style.padding = "15px";
  box.style.borderRadius = "12px";
  box.style.zIndex = "9999";
  box.style.width = "320px";
  box.style.fontSize = "14px";
  box.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

  box.innerHTML = `
    <div style="font-weight:bold; margin-bottom:8px;">
      🌱 Sustainable Assistant
    </div>

    <div style="margin-bottom:10px;">
      <strong>Eco Score:</strong> 
      <span style="color:${color}; font-size:18px;">
        ${score}/10
      </span>
    </div>

    <div style="margin-bottom:10px;">
      ${warnings.map(w => `<div style="margin-bottom:5px;">${w}</div>`).join("")}
    </div>

   <div style="color:#90ee90;">
  ✅ ${suggestion}
</div>
  `;

  document.body.appendChild(box);
}

// 🚀 Run only on product pages
if (isProductPage()) {
  setTimeout(analyzeSustainability, 4000);
}