import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User Already Exist" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashpassword,
  });
  await newUser.save();
  return res.json({ status: true, message: "Record Registered" });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User Not Found" });
  }
  const validePassword = await bcrypt.compare(password, user.password);
  if (!validePassword) {
    return res.json({ message: "Incorrect Password" });
  }

  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
  return res.json({ status: true, message: "Login Successfully" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User Not Registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ahibhushan9@gmail.com",
        pass: process.env.NODEMAILERPASS,
      },
    });

    var mailOptions = {
      from: "ahibhushan9@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:3000/resetpassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "Error sending mail" });
      } else {
        return res.json({ status: true, message: "Email Sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Password Updated" });
  } catch (err) {
    return res.json("Invalid Token");
  }
});

router.get('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.json({status:true})
})
export { router as UserRouter };
