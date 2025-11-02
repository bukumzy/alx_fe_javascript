// Array of quotes with text and category properties
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Please add one!";
    return;
  }

  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update DOM with the random quote and its category
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> "${randomQuote.text}"</p>
    <p><em>Category:</em> ${randomQuote.category}</p>
  `;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Validate inputs
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update DOM to show confirmation
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>New quote added successfully!</p>
    <p><strong>Quote:</strong> "${newQuoteText}"</p>
    <p><em>Category:</em> ${newQuoteCategory}</p>
  `;
}

// Function to dynamically create the Add Quote form (even if it already exists in HTML)
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

// Event listener for the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
