import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now }
}, { minimize: false });

const emailOtpModel = mongoose.models.emailotp || mongoose.model("emailotp", emailOtpSchema);

export default emailOtpModel;

