import express from 'express';
import User from '../models/userModel.js';
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Add entry to user's history
router.post('/add', isAuth, async (req, res) => {
  try {
    const { input, output, details, link } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newEntry = {
      input,
      output,
      details,
      link,
      timestamp: new Date()
    };

    user.history.push(newEntry);
    await user.save();

    res.status(200).json({ message: "History updated successfully" });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get history
router.get('/get', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("history");
    res.status(200).json(user.history.reverse()); // latest first
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

//Destroy route
router.delete('/delete', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.history = [];
    await user.save();
    res.status(200).json({ success: true, message: "History deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete history." });
  }
});


export default router;
