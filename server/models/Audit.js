const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema(
  {
    admin: { type: Object },
    route: String,
    method: String,
    status: Number,
    body: Object,
    ip: String
  },
  { timestamps: true }
);

// OverwriteModelError bachane ke liye:
const Audit =
  mongoose.models.Audit || mongoose.model("Audit", AuditSchema);

module.exports = Audit;
