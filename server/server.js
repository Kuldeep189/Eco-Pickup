require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const http = require("http");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const garbageRoutes = require("./routes/garbageRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const { initSocket } = require("./sockets/socket");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/garbage", garbageRoutes);
app.use("/api", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("EcoPickup server is running ✅");
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Please write a message first." });
  }

  if (!process.env.GROQ_API_KEY) {
    return res
      .status(500)
      .json({ reply: "Chatbot is not configured properly." });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for an eco-awareness garbage management system named EcoPickup.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Unable to generate reply.";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot Error:", err.message);
    res.status(500).json({ reply: "Chatbot server error." });
  }
});
const server = http.createServer(app);
initSocket(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 EcoPickup server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
