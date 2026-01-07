import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer"
import userModel from "../models/userModel.js";
import emailOtpModel from "../models/emailOtpModel.js";


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
                from: `${process.env.BRAND_NAME || 'Priwar Collection'} <${process.env.SMTP_FROM || email}>`,
                to: email,
                subject: "Your verification code",
                text: `Your OTP is ${code}. It expires in 10 minutes.`,
                html: `<p>Your OTP is <b>${code}</b>.</p><p>It expires in 10 minutes.</p>`
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


export { loginUser, registerUser, adminLogin, sendOtp, verifyOtp }
