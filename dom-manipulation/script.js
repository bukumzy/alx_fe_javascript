// ===== Dynamic Quote Generator with Categories, Web Storage & JSON =====

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const quoteInput = document.getElementById("quoteInput");
const categoryInput = document.getElementById("categoryInput");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// ===== Load existing data or defaults =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "Hard work beats talent when talent doesn’t work hard.", category: "Work" },
  { text: "Keep pushing forward!", category: "Inspiration" }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// ===== Populate dropdown with unique categories =====
function populateCategories() {
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear previous options
  categoryFilter.innerHTML = "";

  // Create and append each option
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  categoryFilter.value = selectedCategory;
}


// ===== Filter and show quotes =====
function filterQuotes() {
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// ===== Show random quote (based on selected category) =====
function showRandomQuote() {
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category yet.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `${randomQuote.text} — (${randomQuote.category})`;
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

// ===== Add new quote =====
function addQuote() {
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim() || "Uncategorized";

  if (text) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    quoteInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  }
}

// ===== Save quotes to local storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Export quotes as JSON =====
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Import quotes from JSON =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Event Listeners =====
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);

// ===== Initialize on page load =====
window.addEventListener("load", () => {
  populateCategories();
  showRandomQuote();
});
