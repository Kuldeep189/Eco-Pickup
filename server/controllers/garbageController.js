const GarbageReport = require("../models/GarbageReport");
const User = require("../models/user");

// 🟢 Report Garbage (with image upload + location)
const reportGarbage = async (req, res) => {
  try {
    console.log("✅ Incoming Report Request");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { location, address, description, lat, lng } = req.body;
    const userId = req.user ? req.user.id : req.body.userId;

    if (!userId || !location || !lat || !lng) {
      console.warn("❌ Missing required fields:", { userId, location, lat, lng });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.photoUrl || null;

    // ✅ Create report
    const report = await GarbageReport.create({
      userId,
      photoUrl: imagePath,
      location,
      address: address || "Not provided",
      description: description || "",
      lat,
      lng,
      status: "Pending",
      isPicked: false,
      createdAt: new Date(),
    });

    // 🟢 Give +5 points for reporting
    await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });

    console.log("✅ Report saved successfully:", report);

    res.status(201).json({
      message: "✅ Garbage reported successfully (+5 pts)",
      report,
    });
  } catch (err) {
    console.error("❌ Error creating report:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟣 Get all reports of a user
const getUserReports = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    const reports = await GarbageReport.find({ userId }).sort({ createdAt: -1 });
    console.log(`📋 Found ${reports.length} reports for user ${userId}`);
    res.json(reports);
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🚛 Mark report as picked (and reward +10 points)
const markAsPicked = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await GarbageReport.findById(reportId);

    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.isPicked)
      return res.status(400).json({ message: "Already marked as picked" });

    report.isPicked = true;
    report.status = "Picked";
    await report.save();

    // ✅ Add +10 points to user
    await User.findByIdAndUpdate(report.userId, { $inc: { points: 10 } });

    res.json({
      message: "✅ Report marked as picked (+10 pts)",
      report,
    });
  } catch (err) {
    console.error("❌ Error marking picked:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Export all properly
module.exports = {
  reportGarbage,
  getUserReports,
  markAsPicked,
};
