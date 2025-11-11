import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc Register new user
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User registered successfully. Please login to continue.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    next(error); // pass to errorHandler
  }
};

// @desc Login user
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get current user
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile (name and email)
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Validate that at least one field is provided
    if (!name && !email) {
      res.status(400);
      throw new Error("Please provide at least one field to update (name or email)");
    }

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400);
        throw new Error("Email is already in use by another account");
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    // Validate all fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400);
      throw new Error("Please provide current password, new password, and confirm password");
    }

    // Validate password length
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters long");
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("New password and confirm password do not match");
    }

    // Check if current password is the same as new password
    if (currentPassword === newPassword) {
      res.status(400);
      throw new Error("New password must be different from current password");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordMatched = await user.matchPassword(currentPassword);
    if (!isPasswordMatched) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    next(error);
  }
};
