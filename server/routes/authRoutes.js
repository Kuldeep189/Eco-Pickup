const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmidlleware'); // ✅ fixed spelling
const User = require('../models/user');

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🟢 Register (with avatar)
router.post('/register', upload.single('avatar'), registerUser);

// 🟡 Login
router.post('/login', loginUser);

// 🔵 Protected Profile Route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Include full image URL for frontend
    const userWithAvatar = {
      ...user._doc,
      avatar: user.avatar ? `${req.protocol}://${req.get('host')}/${user.avatar}` : '',
    };

    res.json(userWithAvatar);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
