// Complex words for highlighting
const complexWords = ["quantum","entanglement","phenomenon","entropy","hypothesis"];

// DOM Elements
const conceptInput = document.getElementById("concept");
const explanationInput = document.getElementById("explanation");
const outputDiv = document.getElementById("output");
const simplifyBtn = document.getElementById("simplifyBtn");
const clearBtn = document.getElementById("clearBtn");
const wordCount = document.getElementById("wordCount");
const voiceBtn = document.getElementById("voiceBtn");
const saveHistoryBtn = document.getElementById("saveHistoryBtn");
const historyList = document.getElementById("historyList");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Simplify function
simplifyBtn.addEventListener("click", () => {
  let text = explanationInput.value;
  if (!text.trim()) {
    alert("Please write something first!");
    return;
  }

  let words = text.split(" ");
  let highlighted = words.map(word => {
    return complexWords.includes(word.toLowerCase()) 
      ? `<span style="background:yellow;">${word}</span>` 
      : word;
  }).join(" ");

  outputDiv.innerHTML = highlighted;
});

// Clear function
clearBtn.addEventListener("click", () => {
  conceptInput.value = "";
  explanationInput.value = "";
  outputDiv.innerHTML = "";
  wordCount.textContent = "Words: 0 | Characters: 0";
});

// Word count
explanationInput.addEventListener("input", () => {
  const text = explanationInput.value.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  wordCount.textContent = `Words: ${words} | Characters: ${text.length}`;
});

// Voice Input
voiceBtn.addEventListener("click", () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    explanationInput.value += " " + event.results[0][0].transcript;
  };
  recognition.start();
});

// Save to History
saveHistoryBtn.addEventListener("click", () => {
  const concept = conceptInput.value.trim();
  const explanation = explanationInput.value.trim();
  if (!concept || !explanation) {
    alert("Please enter concept and explanation first!");
    return;
  }

  const item = document.createElement("li");
  item.textContent = concept;
  item.addEventListener("click", () => {
    explanationInput.value = explanation;
    outputDiv.innerHTML = explanation;
  });
  historyList.appendChild(item);

  localStorage.setItem(`history-${concept}`, explanation);
  alert("Saved to history!");
});

// Export to PDF
exportPdfBtn.addEventListener("click", () => {
  const element = document.getElementById("output");
  html2pdf().from(element).save(`${conceptInput.value}-explanation.pdf`);
});

// Dark Mode Toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
