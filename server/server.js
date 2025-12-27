<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const garbageRoutes = require('./routes/garbageRoutes');


// Load environment variables
dotenv.config();
=======
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const garbageRoutes = require("./routes/garbageRoutes");
const { initSocket } = require("./sockets/socket");
>>>>>>> d116f54 (Cleaned repo: removed node_modules and uploads, added core features)

// Initialize express app
const app = express();
<<<<<<< HEAD

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/garbage', garbageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Default route
app.get('/', (req, res) => res.send('Hello from root!'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
=======
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/garbage", garbageRoutes);

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

// 🔥 Initialize Socket.IO professionally
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
>>>>>>> d116f54 (Cleaned repo: removed node_modules and uploads, added core features)
