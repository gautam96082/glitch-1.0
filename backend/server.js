// -------------------- Load Environment Variables --------------------
require('dotenv').config(); // MUST be first line

// -------------------- Dependencies --------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------- App Setup --------------------
const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// -------------------- MongoDB Connection --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- User Schema --------------------
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  history: [{
    concept: String,
    explanation: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', userSchema);

// -------------------- ROUTES -------------------- //

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) 
    return res.status(400).json({ success: false, message: "All fields required" });

  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashed });
    res.json({ success: true, message: "Registered successfully" });
  } catch(err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// Save Explanation Route
app.post('/api/save', async (req, res) => {
  const { token, concept, explanation } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    user.history.push({ concept, explanation });
    await user.save();
    res.json({ success: true, message: "Saved successfully" });
  } catch(err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// Get History Route
app.post('/api/history', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ success: true, history: user.history });
  } catch(err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('Feynman Assistant Backend Running!');
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
