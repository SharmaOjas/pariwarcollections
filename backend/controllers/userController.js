import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer"
import userModel from "../models/userModel.js";
import emailOtpModel from "../models/emailOtpModel.js";

// --- NEW: HTML Template Helper ---
const getOtpEmailTemplate = (otp) => {
    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; font-size: 16px; line-height: 1.5;">
        <p style="margin-bottom: 24px;">Dear Customer,</p>
        
        <p>Your OTP to verify your email is <strong style="font-size: 24px; color: #000; letter-spacing: 2px;">${otp}</strong>.</p>
        
        <p>Valid for 10 minutes. Please do not share this code.</p>
        
        <br />
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="font-style: italic; color: #555;">
          Made to be worn, loved, and passed on.
        </p>
        
        <p style="font-weight: bold; margin-top: 10px; color: #000;">
          — Pariwar Collection
        </p>
      </div>
    `;
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const smtpTransport = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) return null;
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
    });
}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 10 * 60 * 1000;
        await emailOtpModel.findOneAndUpdate(
            { email },
            { email, code, expiresAt, attempts: 0 },
            { upsert: true }
        );
        const tr = smtpTransport();
        if (tr) {
            await tr.sendMail({
                from: `${process.env.BRAND_NAME || 'Pariwar Collection'} <${process.env.SMTP_FROM || email}>`,
                to: email,
                subject: "Verify your email - Pariwar Collection", // Updated subject line
                text: `Dear Customer, Your OTP is ${code}. Valid for 10 minutes. Made to be worn, loved, and passed on. — Pariwar Collection`, // Updated text fallback
                html: getOtpEmailTemplate(code) // <--- Updated to use the new template
            })
        }
        res.json({ success: true, message: "OTP sent" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, code } = req.body;
        const rec = await emailOtpModel.findOne({ email });
        if (!rec) return res.json({ success: false, message: "OTP not found. Please request a new one." })
        if (rec.expiresAt < Date.now()) {
            await emailOtpModel.deleteOne({ email })
            return res.json({ success: false, message: "OTP expired. Please request a new one." })
        }
        const attempts = (rec.attempts || 0) + 1;
        if (attempts > 5) {
            await emailOtpModel.deleteOne({ email })
            return res.json({ success: false, message: "Too many attempts. Please request a new OTP." })
        }
        await emailOtpModel.updateOne({ email }, { attempts })
        if (rec.code !== code) {
            return res.json({ success: false, message: "Invalid OTP" })
        }
        await emailOtpModel.deleteOne({ email })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' },process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}



// Route for password reset
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.json({ success: false, message: "Missing details" });
        }

        const rec = await emailOtpModel.findOne({ email });
        if (!rec) return res.json({ success: false, message: "OTP not found. Please request a new one." })
            
        if (rec.expiresAt < Date.now()) {
            await emailOtpModel.deleteOne({ email })
            return res.json({ success: false, message: "OTP expired. Please request a new one." })
        }

        if (rec.code !== code) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Update user password
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.password = hashedPassword;
        await user.save();

        // Clear OTP
        await emailOtpModel.deleteOne({ email });

        res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, sendOtp, verifyOtp, resetPassword }