/**
 * Asynchronously sends data to the specified URL using POST method and returns the JSON response.
 * @param {string} url - The URL to which the data is to be sent.
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Retrieves the text content of the currently active button.
 * @returns {string} - The text content of the active button or an empty string if no active button is found.
 */
function getActiveButtonText() {
  const activeButton = document.querySelector(".serviceButton.bg-gray-700");
  return activeButton ? activeButton.textContent.trim() : "";
}

/**
 * Handles sending question to server and updates UI with the response.
 */
async function sendQuestion() {
  let questionInput = document.getElementById("questionInput").value;
  document.getElementById("questionInput").value = "";

  // Toggle visibility of the chat screen
  document.querySelector(".right2").style.display = "block";
  document.querySelector(".right1").style.display = "none";

  document.getElementById("question").textContent = questionInput;

  // Construct the question with the active service button text if available
  const activeServiceText = getActiveButtonText();
  const fullQuestion = activeServiceText
    ? `${activeServiceText}: "${questionInput}"`
    : questionInput;

  try {
    const response = await postData("/api", { question: fullQuestion });
    document.getElementById("solution").textContent = response.answer.content;
  } catch (error) {
    console.error("Error sending question:", error);
  }
}

/* Event listeners */

// Clicking send button
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", sendQuestion);

// Clicking new chat button
const newChatButton = document.getElementById("newChatButton");
newChatButton.addEventListener("click", function() {
  document.querySelector(".right2").style.display = "none";
  document.querySelector(".right1").style.display = "block";
});

// Submitting by hitting "enter" key
const questionInputElem = document.getElementById("questionInput");
questionInputElem.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendQuestion();
  }
});

// Active service button clicked
document.addEventListener("click", function (event) {
  // Check if the clicked element has the 'serviceButton' class
  if (event.target.classList.contains("serviceButton")) {
    const btn = event.target;

    const isActive = btn.classList.contains("bg-gray-700");

    // Reset all buttons to bg-gray-600
    const allButtons = document.querySelectorAll(".serviceButton");
    allButtons.forEach(function (button) {
      button.classList.remove("bg-gray-700");
      button.classList.add("bg-gray-600");
    });

    if (!isActive) {
      // Set the clicked button to bg-gray-700
      btn.classList.add("bg-gray-700");
      btn.classList.remove("bg-gray-600");
    }
  }
});

/**
 * Displays the chat corresponding to the given index.
 * @param {number} index - The index of the chat to display.
 */
function displayChat(index) {
  const selectedChat = myChats[index];
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("solution");

  questionElement.textContent = selectedChat[0];
  answerElement.textContent = selectedChat[1];

  document.querySelector(".right2").style.display = "block";
  document.querySelector(".right1").style.display = "none";
}
