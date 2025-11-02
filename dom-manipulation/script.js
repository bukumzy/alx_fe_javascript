// ====== Global Variables ======
let quotes = [];

// ====== Load Quotes from Local Storage ======
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if none saved
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
    ];
  }
  populateCategoryFilter();
}

// ====== Save Quotes to Local Storage ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== Display a Random Quote ======
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }

  const categoryFilter = document.getElementById("categoryFilter").value;
  let filteredQuotes = categoryFilter === "all" ? quotes : quotes.filter(q => q.category === categoryFilter);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><em>- ${randomQuote.category}</em>`;

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ====== Add a New Quote ======
function addQuote() {
  const text = document.getElementById("quoteInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both quote and category fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategoryFilter();

  document.getElementById("quoteInput").value = "";
  document.getElementById("categoryInput").value = "";

  alert("Quote added successfully!");
}

// ====== Populate Category Dropdown ======
function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// ====== Filter Quotes by Category ======
function filterQuotes() {
  showRandomQuote();
}

// ====== Export Quotes to JSON File ======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ====== Import Quotes from JSON File ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format!");
      }
    } catch {
      alert("Error reading JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Initialize App ======
window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();

  // Restore last viewed quote (session storage)
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" <br><em>- ${q.category}</em>`;
  } else {
    showRandomQuote();
  }

  // Event listeners
  document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
});
