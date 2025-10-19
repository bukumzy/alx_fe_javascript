// script.js - Dynamic Quote Generator with LocalStorage + JSON import/export

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Config & DOM ----------
  const LOCAL_KEY = 'dynamic_quote_generator_quotes';
  const SESSION_LAST_INDEX = 'dynamic_quote_generator_last_index'; // optional demo
  const defaultQuotes = [
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  ];

  const currentQuoteEl = document.getElementById('currentQuote');
  const randomBtn = document.getElementById('randomBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const addForm = document.getElementById('addQuoteForm');
  const quoteTextInput = document.getElementById('quoteText');
  const quoteAuthorInput = document.getElementById('quoteAuthor');
  const quotesListEl = document.getElementById('quotesList');
  const exportBtn = document.getElementById('exportBtn');
  const importFileInput = document.getElementById('importFile');
  const clearLocalBtn = document.getElementById('clearLocalBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const feedback = document.getElementById('feedback');

  // ---------- State ----------
  let quotes = [];           // array of {text, author}
  let currentIndex = 0;      // which quote is currently displayed

  // ---------- Utilities ----------
  function saveQuotes() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
      showFeedback('Saved to local storage.');
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      showFeedback('Error: could not save to local storage.', true);
    }
  }

  function loadQuotes() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) {
        quotes = defaultQuotes.slice();
        saveQuotes();
        return;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Saved data is not an array');
      // Validate items are objects with text
      quotes = parsed.filter(q => q && typeof q.text === 'string').map(q => ({ text: q.text, author: q.author || '' }));
    } catch (e) {
      console.warn('Failed to load quotes or invalid data — resetting to defaults:', e);
      quotes = defaultQuotes.slice();
      saveQuotes();
    }
  }

  function showFeedback(msg, isError = false) {
    feedback.textContent = msg;
    feedback.style.color = isError ? '#b00020' : '#1b5e20';
    // fade away after a few seconds
    setTimeout(() => {
      if (feedback.textContent === msg) feedback.textContent = '';
    }, 4500);
  }

  function renderCurrent() {
    if (!quotes.length) {
      currentQuoteEl.textContent = 'No quotes saved yet.';
      return;
    }
    const q = quotes[currentIndex];
    currentQuoteEl.innerHTML = q.author ? `"${escapeHtml(q.text)}" — <span style="font-weight:600">${escapeHtml(q.author)}</span>` : `"${escapeHtml(q.text)}"`;
    // save last shown index to sessionStorage as demonstration
    try { sessionStorage.setItem(SESSION_LAST_INDEX, String(currentIndex)); } catch(e) {}
  }

  function renderList() {
    quotesListEl.innerHTML = '';
    quotes.forEach((q, i) => {
      const li = document.createElement('li');
      li.setAttribute('data-index', i);

      const left = document.createElement('div');
      left.style.flex = '1';

      const p = document.createElement('div');
      p.className = 'quote-meta';
      p.innerHTML = q.author ? `"${escapeHtml(q.text)}" — <em>${escapeHtml(q.author)}</em>` : `"${escapeHtml(q.text)}"`;

      left.appendChild(p);

      const right = document.createElement('div');
      right.style.display = 'flex';
      right.style.gap = '8px';
      right.style.alignItems = 'center';

      const showBtn = document.createElement('button');
      showBtn.className = 'small-btn';
      showBtn.textContent = 'Show';
      showBtn.addEventListener('click', () => {
        currentIndex = i;
        renderCurrent();
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'small-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        if (!confirm('Remove this quote?')) return;
        quotes.splice(i, 1);
        if (currentIndex >= quotes.length) currentIndex = Math.max(0, quotes.length - 1);
        saveQuotes();
        renderList();
        renderCurrent();
      });

      right.appendChild(showBtn);
      right.appendChild(removeBtn);

      li.appendChild(left);
      li.appendChild(right);
      quotesListEl.appendChild(li);
    });
  }

  // Basic HTML escaping for injecting text
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ---------- Actions ----------
  function addQuote(text, author) {
    const trimmedText = (text || '').trim();
    if (!trimmedText) { showFeedback('Please enter quote text.', true); return; }
    quotes.push({ text: trimmedText, author: (author || '').trim() });
    currentIndex = quotes.length - 1;
    saveQuotes();
    renderList();
    renderCurrent();
    showFeedback('Quote added.');
  }

  function showRandom() {
    if (!quotes.length) { showFeedback('No quotes available.', true); return; }
    currentIndex = Math.floor(Math.random() * quotes.length);
    renderCurrent();
  }

  function showNext() {
    if (!quotes.length) return;
    currentIndex = (currentIndex + 1) % quotes.length;
    renderCurrent();
  }

  function showPrev() {
    if (!quotes.length) return;
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    renderCurrent();
  }

  // Export quotes to JSON file
  function exportToJson() {
    try {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotes-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showFeedback('Quotes exported.');
    } catch (e) {
      console.error(e);
      showFeedback('Export failed.', true);
    }
  }

  // Import from JSON file (validates structure)
  function importFromJsonFile(file) {
    if (!file) return showFeedback('No file selected.', true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error('Imported JSON must be an array of {text, author} objects.');
        // Validate and normalize
        const imported = parsed
          .filter(item => item && typeof item.text === 'string')
          .map(item => ({ text: item.text.trim(), author: (item.author || '').trim() }))
          .filter(item => item.text.length > 0);

        if (!imported.length) throw new Error('No valid quotes found in file.');

        // Option: avoid duplicates (simple check by text)
        const existingTexts = new Set(quotes.map(q => q.text));
        const uniqueNew = imported.filter(i => !existingTexts.has(i.text));
        quotes.push(...uniqueNew);

        if (uniqueNew.length === 0) {
          showFeedback('No new quotes were added (all duplicates).');
        } else {
          saveQuotes();
          renderList();
          renderCurrent();
          showFeedback(`${uniqueNew.length} quote(s) imported successfully.`);
        }
      } catch (err) {
        console.error('Import error', err);
        showFeedback('Import failed: ' + (err.message || 'invalid JSON'), true);
      }
    };
    reader.onerror = () => showFeedback('File read error.', true);
    reader.readAsText(file);
  }

  function clearLocalStorage() {
    if (!confirm('Are you sure you want to clear saved quotes? This cannot be undone.')) return;
    localStorage.removeItem(LOCAL_KEY);
    loadQuotes();
    renderList();
    renderCurrent();
    showFeedback('Local storage cleared. Default quotes restored.');
  }

  function clearAllStorage() {
    if (!confirm('Clear both localStorage and sessionStorage?')) return;
    localStorage.removeItem(LOCAL_KEY);
    try { sessionStorage.clear(); } catch(e) {}
    loadQuotes();
    renderList();
    renderCurrent();
    showFeedback('Local and session storage cleared.');
  }

  // ---------- Event Listeners ----------
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addQuote(quoteTextInput.value, quoteAuthorInput.value);
    addForm.reset();
  });

  randomBtn.addEventListener('click', showRandom);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  exportBtn.addEventListener('click', exportToJson);

  importFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importFromJsonFile(e.target.files[0]);
      // Clear the input so same file can be reselected if needed
      e.target.value = '';
    }
  });

  clearLocalBtn.addEventListener('click', clearLocalStorage);
  clearAllBtn.addEventListener('click', clearAllStorage);

  // ---------- Initialize ----------
  loadQuotes();
  renderList();

  // restore last shown index from session storage if available
  try {
    const lastIndex = Number(sessionStorage.getItem(SESSION_LAST_INDEX));
    if (!Number.isNaN(lastIndex) && lastIndex >= 0 && lastIndex < quotes.length) {
      currentIndex = lastIndex;
    } else {
      currentIndex = 0;
    }
  } catch (e) {
    currentIndex = 0;
  }

  renderCurrent();
});
