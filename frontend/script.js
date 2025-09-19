/* ===== Login Logic ===== */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username && password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "app.html";
      } else {
        alert("Please enter both username and password.");
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  }

  // Check session on app page
  if (window.location.pathname.includes("app.html") && !localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
  }
});

/* ===== Main App Logic ===== */
document.addEventListener("DOMContentLoaded", () => {
  const conceptEl = document.getElementById("concept");
  const explanationEl = document.getElementById("explanation");
  const simplifyBtn = document.getElementById("simplifyBtn");
  const autoSimplifyBtn = document.getElementById("autoSimplifyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const outputBox = document.getElementById("outputBox");
  const jargonCountEl = document.getElementById("jargonCount");
  const readScoreEl = document.getElementById("readScore");

  if (!simplifyBtn) return; // Prevent errors on login page

  const complexWords = [
    "quantum", "entanglement", "phenomenon", "correlated",
    "relativity", "algorithm", "entropy", "hypothesis"
  ];

  const simpleMap = {
    phenomenon: "event",
    entanglement: "deep connection",
    correlated: "linked",
    relativity: "relationship with motion and gravity",
    algorithm: "step-by-step recipe",
    entropy: "measure of disorder",
    hypothesis: "idea to test"
  };

  function highlightText(text) {
    return text
      .split(/\s+/)
      .map(word =>
        complexWords.includes(word.toLowerCase())
          ? `<span class="highlight">${word}</span>`
          : word
      )
      .join(" ");
  }

  function readabilityScore(text) {
    const words = text.split(/\s+/).filter(Boolean).length || 1;
    return 200 - words * 2; // simplified readability score
  }

  simplifyBtn.addEventListener("click", () => {
    const explanation = explanationEl.value.trim();
    if (!explanation) {
      alert("Please enter an explanation first!");
      return;
    }
    outputBox.innerHTML = highlightText(explanation);
    jargonCountEl.textContent = `Jargon: ${complexWords.filter(w => explanation.toLowerCase().includes(w)).length}`;
    readScoreEl.textContent = `Readability Score: ${readabilityScore(explanation)}`;
  });

  autoSimplifyBtn.addEventListener("click", () => {
    let explanation = explanationEl.value.trim();
    if (!explanation) return alert("Please enter an explanation first!");
    for (let [key, value] of Object.entries(simpleMap)) {
      explanation = explanation.replace(new RegExp(key, "gi"), value);
    }
    explanationEl.value = explanation;
    outputBox.innerHTML = highlightText(explanation);
  });

  clearBtn.addEventListener("click", () => {
    conceptEl.value = "";
    explanationEl.value = "";
    outputBox.innerHTML = "";
    jargonCountEl.textContent = "";
    readScoreEl.textContent = "";
  });
});
