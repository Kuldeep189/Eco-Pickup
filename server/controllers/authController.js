const User = require("../models/user");
const GarbageReport = require("../models/GarbageReport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = req.file ? `uploads/${req.file.filename}` : "";

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= PROFILE (🔥 FIXED) =================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const reports = await GarbageReport.find({ userId });

    // 🔥 REAL STATS
    const reportsCount = reports.length;
    const locationsUpdated = new Set(reports.map(r => r.location)).size;
    const reportsApproved = reports.filter(r => r.status === "Picked").length;
    const pickupsCompleted = reports.filter(r => r.isPicked === true).length;

    res.json({
      ...user.toObject(),
      reportsCount,
      locationsUpdated,
      reportsApproved,
      pickupsCompleted,
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
