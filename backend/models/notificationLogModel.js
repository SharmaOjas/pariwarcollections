import mongoose from "mongoose";

const notificationLogSchema = new mongoose.Schema({
  subscriptionId: { type: String, required: true },
  productId: { type: String, required: true },
  channel: { type: String, required: true },
  status: { type: String, required: true },
  messageId: { type: String, default: "" },
  error: { type: String, default: "" },
  timestamp: { type: Number, default: Date.now },
  meta: { type: Object, default: {} }
}, { minimize: false });

const notificationLogModel = mongoose.models.notificationlog || mongoose.model("notificationlog", notificationLogSchema);

export default notificationLogModel;

