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

// ====================
// 🔄 SYNCING WITH SERVER
// ====================

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock server endpoint

// 1️⃣ Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Simulate 5 server quotes
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

// 5️⃣ Main Sync Function (required name)
async function syncQuotes() {
  console.log("🔁 Starting sync with server...");
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);

  // Save merged version locally
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  displayQuote(); // refresh displayed quote

  await pushQuotesToServer(mergedQuotes);

  // ✅ Required alert
  alert("Quotes synced with server!");

  console.log("✅ Sync complete:", new Date().toLocaleTimeString());
}


// 6️⃣ Automatically sync every 30 seconds
setInterval(syncQuotes, 30000);



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
