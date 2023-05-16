import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/UserModel.js";

export const Register = async (req, res) => {
  const { firstname, lastname, email, password, confPassword, mobile } = req.body;

  const userEmail = await User.findOne({ email });
  if (userEmail) {
    if (userEmail.email === email) return res.status(400).json({ message: "Email already exists" });
  }
  const userMobile = await User.findOne({ mobile });
  if (userMobile) {
    if (userMobile.mobile === mobile) return res.status(400).json({ message: "Mobile number already exists" });
  }

  if (password !== confPassword) return res.status(400).json({ message: "password and confirm password don't match" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const data = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashPassword,
      mobile: mobile,
    });

    res.status(200).json({
      success: true,
      message: "Register Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await User.findById(id);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;
  const { firstname, lastname, email, mobile } = req.body;

  try {
    const data = await User.findByIdAndUpdate(
      id,
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        mobile: mobile,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      message: "update success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "delete success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(404).json({ message: "User not found" });
    const match = await bcrypt.compare(password, findUser.password);
    if (!match) return res.status(401).json({ message: "Wrong Password" });

    const id = findUser.id;

    const token = jwt.sign({ id, email }, process.env.JWT, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id, email }, process.env.REFRESH, {
      expiresIn: "1d",
    });

    console.log({ token, refreshToken });

    await User.findByIdAndUpdate(
      id,
      {
        refreshtoken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshtoken", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Login success",
      data: {
        name: findUser.name,
        email: findUser.email,
        mobile: findUser.mobile,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
