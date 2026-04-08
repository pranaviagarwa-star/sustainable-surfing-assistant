document.getElementById("scanBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {

      console.log("Eco Scan Running...");

      // 🧠 Detect product title (multi-site)
      let title = "";

      const selectors = [
        "#productTitle",     // Amazon
        ".B_NuCI",           // Flipkart
        ".pdp-name",         // Myntra
        "h1",
        "title"
      ];

      for (let sel of selectors) {
        let el = document.querySelector(sel);
        if (el && el.innerText && el.innerText.trim().length > 5) {
          title = el.innerText.trim();
          break;
        }
      }

      // Combine title + page text
      const text = (title + " " + document.body.innerText).toLowerCase();

      let warnings = [];
      let score = 10;

      // 🌴 Palm oil
      if (text.match(/palm oil|palmolein|vegetable oil/)) {
        warnings.push("🌴 Palm oil → deforestation risk");
        score -= 2;
      }

      // 👕 Fast fashion
      if (text.match(/polyester|nylon|acrylic/)) {
        warnings.push("👕 Synthetic fabric → pollution");
        score -= 2;
      }

      // 🐄 Animal materials
      if (text.match(/leather|fur|suede|wool/)) {
        warnings.push("🐄 Animal material → high environmental impact");
        score -= 2;
      }

      // 📦 Plastic
      if (text.match(/plastic|single-use/)) {
        warnings.push("📦 Plastic → waste issue");
        score -= 1;
      }

      // ⚡ Electronics
      if (text.match(/phone|laptop|battery|tv|charger/)) {
        warnings.push("⚡ Electronics → high carbon footprint");
        score -= 2;
      }

      // Ensure score minimum
      if (score < 1) score = 1;

      // Remove old popup if exists
      const old = document.getElementById("eco-popup");
      if (old) old.remove();

      // 🎨 UI container
      const box = document.createElement("div");
      box.id = "eco-popup";

      let color = score >= 7 ? "#4CAF50" : score >= 4 ? "#FFC107" : "#F44336";
      let percent = score * 10;

      box.style.position = "fixed";
      box.style.bottom = "20px";
      box.style.right = "20px";
      box.style.background = "#1b1b1b";
      box.style.color = "#fff";
      box.style.padding = "16px";
      box.style.borderRadius = "14px";
      box.style.zIndex = "999999";
      box.style.width = "320px";
      box.style.fontFamily = "Arial";
      box.style.boxShadow = "0 0 15px rgba(0,0,0,0.6)";

      box.innerHTML = `
        <div style="font-size:12px; opacity:0.6;">Product</div>
        <div style="font-size:14px; margin-bottom:10px;">
          ${title || "Product detected"}
        </div>

        <div style="margin-bottom:6px;">
          <b>Eco Score: <span style="color:${color}">${score}/10</span></b>
        </div>

        <!-- Progress Bar -->
        <div style="background:#333; border-radius:10px; overflow:hidden; height:10px; margin-bottom:12px;">
          <div id="eco-bar" style="
            width:0%;
            height:100%;
            background:${color};
            transition: width 1s ease;
          "></div>
        </div>

        <div style="font-size:13px;">
          ${warnings.length ? warnings.map(w => `<div style="margin-bottom:5px;">${w}</div>`).join("") : "✅ No major issues detected"}
        </div>

        <div style="margin-top:10px; color:#90ee90; font-size:13px;">
          🌿 Consider eco-friendly alternatives
        </div>
      `;

      document.body.appendChild(box);

      // 🎬 Animate progress bar
      setTimeout(() => {
        const bar = document.getElementById("eco-bar");
        if (bar) bar.style.width = percent + "%";
      }, 100);
    }
  });
});