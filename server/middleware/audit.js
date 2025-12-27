// C:\EcoPickup\server\middleware\audit.js
const Audit = require("../models/Audit");

module.exports = async (req, res, next) => {
  res.on("finish", async () => {
    try {
      const admin = req.admin
        ? { id: req.admin._id, email: req.admin.email }
        : null;

      await Audit.create({
        admin,
        route: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        body: req.body,
        ip: req.ip
      });
    } catch (e) {
      console.error("Audit error", e);
    }
  });

  next();
};
