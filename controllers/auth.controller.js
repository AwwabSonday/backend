import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// Helper to generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "cubeverse_jwt_secret_token_key_super_secure_2026_9999";
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    // Check if email already registered
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email address is already registered. Please log in.",
      });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "This username is already taken. Please choose another.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: newUser._id,
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bestTime: newUser.bestTime,
        currentTime: newUser.currentTime,
        average: newUser.average,
        solvesCount: newUser.solvesCount,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while registering user.",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const cleanInput = email.toLowerCase().trim();

    // Support login via email or username
    const user = await User.findOne({
      $or: [{ email: cleanInput }, { username: email.trim() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        bestTime: user.bestTime,
        currentTime: user.currentTime,
        average: user.average,
        solvesCount: user.solvesCount,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while logging in.",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        bestTime: user.bestTime,
        currentTime: user.currentTime,
        average: user.average,
        solvesCount: user.solvesCount,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching user profile.",
    });
  }
};
