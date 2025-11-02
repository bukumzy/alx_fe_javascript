// ====================
// 🔧 INITIALIZATION
// ====================

// Load quotes from localStorage when the page loads
window.addEventListener("DOMContentLoaded", () => {
  const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  quotes = savedQuotes;
  displayQuote();

  // Load last viewed quote from sessionStorage
  const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (lastQuote) {
    currentQuote = lastQuote;
    displayQuote();
  }
});

// Save last viewed quote to sessionStorage whenever a quote changes
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ====================
// 🔄 SYNCING WITH SERVER
// ====================

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// 1️⃣ Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      author: "Server User",
      category: "server"
    }));
  } catch (error) {
    console.error("❌ Failed to fetch from server:", error);
    return [];
  }
}

// 2️⃣ Push local quotes to server (simulation)
async function pushQuotesToServer(localQuotes) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localQuotes)
    });
    console.log("✅ Quotes synced to server successfully!");
  } catch (error) {
    console.error("❌ Failed to sync quotes:", error);
  }
}

// 3️⃣ Resolve conflicts (server wins)
function resolveConflicts(localQuotes, serverQuotes) {
  const merged = [...localQuotes];

  serverQuotes.forEach(serverQuote => {
    const exists = merged.some(local => local.text === serverQuote.text);
    if (!exists) {
      merged.push(serverQuote);
    } else {
      const index = merged.findIndex(local => local.text === serverQuote.text);
      merged[index] = serverQuote;
      notifyUser(`Conflict resolved: Updated quote "${serverQuote.text}" from server.`);
    }
  });

  return merged;
}

// 4️⃣ Notify user of syncs or conflicts
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 4000);
}

// 5️⃣ Main Sync Function
async function syncQuotes() {
  console.log("🔁 Starting sync with server...");
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);

  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  displayQuote();
  await pushQuotesToServer(mergedQuotes);

  alert("Quotes synced with server!");
  console.log("✅ Sync complete:", new Date().toLocaleTimeString());
}

// 6️⃣ Automatically sync every 30 seconds
setInterval(syncQuotes, 30000);

// ====================
// 📤 EXPORT & 📥 IMPORT QUOTES
// ====================

// Export quotes to JSON file
function exportToJsonFile() {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "quotes.json");
  dlAnchor.click();
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      localStorage.setItem("quotes", JSON.stringify(importedQuotes));
      quotes = importedQuotes;
      displayQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid file format!");
    }
  };
  reader.readAsText(file);
}

// ====================
// 🎛️ EVENT LISTENERS
// ====================


document.getElementById("exportBtn")?.addEventListener("click", exportToJsonFile);
document.getElementById("importFileInput")?.addEventListener("change", importFromJsonFile);
