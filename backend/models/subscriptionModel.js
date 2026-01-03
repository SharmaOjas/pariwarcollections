import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, default: "", required: false },
  email: { type: String },
  phone: { type: String },
  productId: { type: String, required: true },
  channels: { type: Object, default: { email: true, whatsapp: false } },
  preferredLanguage: { type: String, default: "en" },
  active: { type: Boolean, default: true },
  lastNotifiedAt: { type: Number, default: 0 },
  lastNotifiedStatus: { type: String, default: "" },
  createdAt: { type: Number, default: Date.now }
}, { minimize: false });

const subscriptionModel = mongoose.models.subscription || mongoose.model("subscription", subscriptionSchema);

export default subscriptionModel;

