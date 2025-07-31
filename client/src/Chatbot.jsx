import React, { useState } from "react";
import axios from "axios";

const API_KEY = process.env.api_key; // Replace with your real key

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const callGeminiAPI = async (userInput) => {
  const MODEL = "gemini-2.5-flash"; // or "gemini-2.5-pro"
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: userInput }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.candidates?.[0]?.content?.parts?.[0]?.text
      ?? "Sorry, I didn’t get a response.";
  } catch (err) {
    console.error("API Error:", err.response?.data || err);
    return "API request failed.";
  }
};


  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const botReply = await callGeminiAPI(input);
    const botMessage = { text: botReply, sender: "bot" };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card">
        <div className="card-header bg-primary text-white">Gemini Chatbot</div>
        <div className="card-body overflow-auto" style={{ height: "400px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-2 ${
                msg.sender === "user" ? "justify-content-end" : ""
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === "bot"
                    ? "bg-light text-dark"
                    : "bg-primary text-white"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-muted">Bot is typing...</div>}
        </div>
        <div className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
