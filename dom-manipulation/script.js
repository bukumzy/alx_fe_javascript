const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock server endpoint
// Fetch data (simulate pulling quotes from server)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // For simulation, we'll take only first few items and map them as quotes
    return data.slice(0, 5).map(item => ({
      text: item.title,
      author: "Server User",
      category: "server"
    }));
  } catch (error) {
    console.error("Failed to fetch from server:", error);
    return [];
  }
}

// Push local quotes to server (simulate sending updates)
async function pushQuotesToServer(localQuotes) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localQuotes)
    });
    console.log("Quotes synced to server successfully!");
  } catch (error) {
    console.error("Failed to sync quotes:", error);
  }
}
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Compare and resolve conflicts
  const merged = resolveConflicts(localQuotes, serverQuotes);

  // Update local storage
  localStorage.setItem("quotes", JSON.stringify(merged));
  quotes = merged;
  displayQuote();

  // Push latest version to server
  await pushQuotesToServer(merged);

  console.log("Sync complete at", new Date().toLocaleTimeString());
}

// Sync every 30 seconds
setInterval(syncWithServer, 30000);
function resolveConflicts(localQuotes, serverQuotes) {
  const merged = [...localQuotes];

  serverQuotes.forEach(serverQuote => {
    const exists = merged.some(local => local.text === serverQuote.text);
    if (!exists) {
      merged.push(serverQuote);
    } else {
      // Conflict: server quote overrides local
      const index = merged.findIndex(local => local.text === serverQuote.text);
      merged[index] = serverQuote;
      notifyUser(`Conflict resolved: Updated quote "${serverQuote.text}" from server.`);
    }
  });

  return merged;
}
function notifyUser(message) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = message;
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 4000);
}
