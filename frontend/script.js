// ===== Redirect if not logged in =====
if (!localStorage.getItem('loggedIn')) window.location.href = 'index.html';

// ===== Elements =====
const conceptEl = document.getElementById('concept');
const explanationEl = document.getElementById('explanation');
const simplifyBtn = document.getElementById('simplifyBtn');
const autoSimplifyBtn = document.getElementById('autoSimplifyBtn');
const clearBtn = document.getElementById('clearBtn');
const outputBox = document.getElementById('outputBox');
const jargonCountEl = document.getElementById('jargonCount');
const readScoreEl = document.getElementById('readScore');
const historyList = document.getElementById('historyList');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const voiceBtn = document.getElementById('voiceBtn');
const pdfBtn = document.getElementById('pdfBtn');

// ===== Complex Words =====
const complexWords = [
  "quantum","entanglement","phenomenon","correlated","relativity",
  "metaphysics","neuroscience","algorithm","entropy","hypothesis",
  "paradigm","stochastic","heuristic","ontology","epistemology",
  "thermodynamics","synthesis","anomaly","spectroscopy","isotope"
];
const complexSet = new Set(complexWords.map(w => w.toLowerCase()));

// ===== Helper Functions =====
function cleanWord(word) { return word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g,''); }
function escapeHtml(s) { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// ===== Highlight & Stats =====
function highlight(text) {
  const tokens = text.split(/(\s+)/);
  const html = tokens.map(tok => {
    if (/^\s+$/.test(tok)) return tok.replace(/\n/g,'<br>');
    const core = cleanWord(tok);
    if (!core) return escapeHtml(tok);
    if (complexSet.has(core.toLowerCase())) {
      return `<span class="highlight" data-tip="Consider simpler word">${escapeHtml(tok)}</span>`;
    }
    return escapeHtml(tok);
  }).join('');
  outputBox.innerHTML = html || "<span class='small'>No output</span>";

  // Stats
  const words = text.split(/\s+/).map(w=>cleanWord(w)).filter(Boolean);
  const count = [...new Set(words.filter(w=>complexSet.has(w.toLowerCase())))].length;
  const readability = Math.round(206.835 - 1.015*(words.length/Math.max(1, (text.match(/[.!?]+/g)||[]).length)) - 84.6*(words.reduce((a,w)=>a+Math.max(1,w.match(/[aeiouy]{1,2}/gi)?.length||1),0)/Math.max(1, words.length)));
  jargonCountEl.textContent = count ? `Jargon: ${count}` : '';
  readScoreEl.textContent = `Readability: ${readability}`;
}

// ===== Auto-simplify Map =====
const simpleMap = {
  "phenomenon":"event",
  "entanglement":"deep connection",
  "correlated":"linked",
  "relativity":"relationship with motion and gravity",
  "metaphysics":"big questions about reality",
  "neuroscience":"study of the brain",
  "algorithm":"step-by-step recipe",
  "entropy":"measure of disorder",
  "hypothesis":"idea to test",
  "paradigm":"way of thinking"
};
function autoSimplify(text) {
  const tokens = text.split(/(\s+)/);
  return tokens.map(tok => {
    if (/^\s+$/.test(tok)) return tok;
    const core = cleanWord(tok);
    if (!core) return tok;
    const low = core.toLowerCase();
    if (simpleMap[low]) {
      const prefix = tok.match(/^[^a-zA-Z]*/)[0] || '';
      const suffix = tok.match(/[^a-zA-Z]*$/)[0] || '';
      return prefix + simpleMap[low] + suffix;
    }
    return tok;
  }).join('');
}

// ===== History =====
function addHistory(concept, explanation) {
  const li = document.createElement('li');
  li.textContent = `${concept}: ${explanation.substring(0,50)}${explanation.length>50?'...':''}`;
  historyList.prepend(li);
}

// ===== Voice Input =====
voiceBtn.addEventListener('click', ()=>{
  if (!('webkitSpeechRecognition' in window)) { alert('Voice input not supported'); return; }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = e => { explanationEl.value += ' ' + e.results[0][0].transcript; };
  recognition.start();
});

// ===== PDF Export =====
pdfBtn.addEventListener('click', ()=>{
  if (!outputBox.innerHTML) { alert('No output to export'); return; }
  html2pdf().from(outputBox).set({ margin:0.5, filename:'FeynmanOutput.pdf' }).save();
});

// ===== Theme Toggle =====
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀ Light Mode':'🌙 Dark Mode';
});

// ===== Logout =====
logoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem('loggedIn');
  window.location.href='index.html';
});

// ===== Simplify / Auto-simplify / Clear =====
simplifyBtn.addEventListener('click', ()=>{
  if(!explanationEl.value.trim()){ alert('Write an explanation first'); return; }
  highlight(explanationEl.value);
  addHistory(conceptEl.value || 'Untitled', explanationEl.value);
});

autoSimplifyBtn.addEventListener('click', ()=>{
  if(!explanationEl.value.trim()){ alert('Write an explanation first'); return; }
  const simplified = autoSimplify(explanationEl.value);
  if(simplified === explanationEl.value){ alert('No simplifications available'); return; }
  if(confirm('Replace your text with simpler suggestions?')) explanationEl.value = simplified;
  highlight(simplified);
  addHistory(conceptEl.value || 'Untitled', simplified);
});

clearBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all input and output?')) return;
  conceptEl.value=''; explanationEl.value=''; outputBox.innerHTML=''; jargonCountEl.textContent=''; readScoreEl.textContent='';
});
