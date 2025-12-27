const mongoose = require("mongoose");

const garbageReportSchema = new mongoose.Schema(
  
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    photoUrl: { type: String },
    location: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, default: "Pending" },
       isPicked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GarbageReport", garbageReportSchema);
