// ===== Dynamic Quote Generator with Web Storage and JSON Handling =====

// Select elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const quoteInput = document.getElementById("quoteInput");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

// ===== Step 1: Initialize quotes array =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  "Believe in yourself!",
  "Hard work beats talent when talent doesn’t work hard.",
  "Keep pushing forward!",
];

// ===== Step 2: Display random quote =====
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = randomQuote;

  // Optional: Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", randomQuote);
}

// ===== Step 3: Add new quote =====
function addQuote() {
  const newQuote = quoteInput.value.trim();
  if (newQuote) {
    quotes.push(newQuote);
    saveQuotes(); // Save updated quotes to localStorage
    quoteInput.value = "";
    alert("Quote added successfully!");
  }
}

// ===== Step 4: Save quotes to Local Storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Step 5: Export quotes as JSON =====
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

// ===== Step 6: Import quotes from JSON file =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Please upload an array of quotes.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Step 7: Event listeners =====
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);

// ===== Step 8: Initialize on page load =====
window.addEventListener("load", () => {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    quoteDisplay.textContent = lastQuote;
  } else {
    showRandomQuote();
  }
});
