require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: message }]
      }
    ]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
