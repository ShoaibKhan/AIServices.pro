async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function getActiveButtonText() {
  const activeButton = document.querySelector(".serviceButton.bg-gray-700");
  return activeButton ? activeButton.textContent : "";
}

// Function to handle sending the question
async function sendQuestion() {
  let questionInput = document.getElementById("questionInput").value;
  document.getElementById("questionInput").value = "";
  document.querySelector(".right2").style.display = "block";
  document.querySelector(".right1").style.display = "none";

  question.innerHTML = questionInput;

  const activeText = getActiveButtonText();
  questionInput = activeText + ': """' + questionInput + '"""';

  let response = await postData("/api", { question: questionInput });
  solution.innerHTML = response.answer.content;
}

sendButton.addEventListener("click", function () {
  sendQuestion();
});

document
  .getElementById("questionInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendQuestion();
    }
  });

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

function displayChat(index) {
  const selectedChat = myChats[index];
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("solution");

  // Update the content of the question and answer elements
  questionElement.textContent = selectedChat[0];
  answerElement.textContent = selectedChat[1];

  // Show the active chat screen and hide others if necessary
  document.querySelector(".right2").style.display = "block";
  document.querySelector(".right1").style.display = "none";
  // ... any other sections you might want to hide
}

async function deleteChat(index) {
  const response = await fetch("/delete-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ index: index }),
  });

  if (response.ok) {
    // Remove the chat from the DOM
    document.querySelectorAll(".chat")[index].remove();
  } else {
    console.error("Failed to delete the chat");
  }
}
