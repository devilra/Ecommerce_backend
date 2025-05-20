import User from "../models/Users.js";
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log(user);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);
  // console.log(user);
  // console.log("Uploaded file:", req.file);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      user.image = `uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
