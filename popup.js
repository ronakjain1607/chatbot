const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chat");

const GEMINI_API_KEY = "AIzaSyA3Z2HibCYLKjPv-AkPx9w1is22Ml3UsWo"; // Replace with your actual API key

// Event listener for Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

sendBtn.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("You", input, "user");
  userInput.value = "";

  const loadingId = appendMessage("Gemini", "Gemini is thinking...", "loading");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: input
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    updateMessage(loadingId, reply, "gemini");
  } catch (err) {
    updateMessage(loadingId, "❌ Failed to connect to Gemini API.", "gemini");
  }
});

function appendMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  if (type === "user") {
    msg.classList.add("user");
  } else if (type === "gemini") {
    msg.classList.add("gemini");
  } else if (type === "loading") {
    msg.classList.add("gemini", "loading");
  }

  msg.textContent = `${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // return for update
}

function updateMessage(msgElem, newText, newClass) {
  msgElem.classList.remove("loading");
  msgElem.classList.add(newClass);
  msgElem.textContent = newText;
}
