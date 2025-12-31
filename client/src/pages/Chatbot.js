import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

const SUGGESTIONS = [
  "How do I report a garbage spot?",
  "What is EcoPickup?",
  "How are reward points calculated?",
  "How can I track my previous reports?",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I’m EcoBot 🤖\nI can help you with EcoPickup, garbage reporting and rewards. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (textFromSuggestion) => {
    const finalText = (textFromSuggestion ?? input).trim();
    if (!finalText) return;

    const userMsg = { from: "user", text: finalText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalText }),
      });

      const data = await res.json();
      const botMsg = {
        from: "bot",
        text: data.reply || "No reply from server.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot frontend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I can't reach the server right now 😢. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  return (
    <>
      {/* 👇 FAB only when chat is CLOSED */}
      {!open && (
        <button
          className="chatbot-fab"
          onClick={() => setOpen(true)}
          aria-label="Open EcoBot chat"
        >
          🤖
        </button>
      )}

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                🤖
              </div>
              <div>
                <div className="chatbot-title">EcoBot</div>
                <div className="chatbot-subtitle">
                  <span className="chatbot-status-dot" /> Online · EcoPickup Assistant
                </div>
              </div>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chatbot-message-row ${
                  m.from === "user" ? "chatbot-message-row-user" : "chatbot-message-row-bot"
                }`}
              >
                <div
                  className={`chatbot-bubble ${
                    m.from === "user" ? "chatbot-bubble-user" : "chatbot-bubble-bot"
                  }`}
                >
                  {m.text.split("\n").map((line, idx, arr) => (
                    <span key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message-row chatbot-message-row-bot">
                <div className="chatbot-bubble chatbot-bubble-bot chatbot-typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-suggestions">
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                className="chatbot-pill"
                onClick={() => handleSuggestionClick(text)}
              >
                {text}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <textarea
              rows={1}
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask EcoBot"
            />
            <button
              className="chatbot-send-btn"
              type="button"
              onClick={() => sendMessage()}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
