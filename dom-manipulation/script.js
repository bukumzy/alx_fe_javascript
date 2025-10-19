// Step 1: Initialize quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
];

// Step 2: Get references to core elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Step 3: Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear old quote
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteBox = document.createElement("div");
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("small");

  quoteText.textContent = `"${quote.text}"`;
  quoteCategory.textContent = `— ${quote.category}`;

  // Style it a bit (optional)
  quoteBox.style.border = "1px solid #ddd";
  quoteBox.style.padding = "10px";
  quoteBox.style.borderRadius = "8px";
  quoteBox.style.marginTop = "10px";
  quoteBox.style.backgroundColor = "#fafafa";

  // Append to DOM
  quoteBox.appendChild(quoteText);
  quoteBox.appendChild(quoteCategory);
  quoteDisplay.appendChild(quoteBox);
}

// Step 4: Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  // Create a container
  const formContainer = document.createElement("div");
  formContainer.id = "addQuoteContainer";
  formContainer.style.marginTop = "20px";

  // Input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.style.marginRight = "10px";

  // Input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.marginRight = "10px";

  // Add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  // Append everything into the container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Finally, append form to the body (below everything else)
  document.body.appendChild(formContainer);
}

// Step 5: Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields!");
    return;
  }

  // Add new quote object to the array
  quotes.push({ text: newText, category: newCategory });

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("✅ New quote added successfully!");
}

// Step 6: Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Step 7: Initialize on page load
showRandomQuote();
createAddQuoteForm(); // Dynamically add the input form
