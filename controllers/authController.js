const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password, role });
    const token = generateToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.json({ user: req.user });
};