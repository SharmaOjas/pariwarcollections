import express from "express";
import subscriptionModel from "../models/subscriptionModel.js";
import { unsubscribeByToken } from "../utils/notificationService.js";
import notificationLogModel from "../models/notificationLogModel.js";

const notifyRouter = express.Router();

notifyRouter.post("/subscribe", async (req, res) => {
  try {
    const { userId, productId, email, phone, channels, preferredLanguage } = req.body;
    const query = userId ? { userId, productId } : (email ? { productId, email } : { productId, phone });
    const existing = await subscriptionModel.findOne(query);
    if (existing) {
      await subscriptionModel.findByIdAndUpdate(existing._id, { userId, email, phone, channels, preferredLanguage, active: true });
      return res.json({ success: true, message: "Subscription updated" });
    }
    await subscriptionModel.create({ userId: userId || "", productId, email, phone, channels, preferredLanguage, active: true });
    res.json({ success: true, message: "Subscribed" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

notifyRouter.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query;
    const ok = await unsubscribeByToken(token);
    res.json({ success: ok });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

notifyRouter.get("/track/open", async (req, res) => {
  try {
    const sid = req.query.sid || "";
    if (sid) {
      await notificationLogModel.create({ subscriptionId: sid, productId: "", channel: "email", status: "open", timestamp: Date.now() });
    }
    const pixel = Buffer.from("R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", "base64");
    res.setHeader("Content-Type", "image/gif");
    res.send(pixel);
  } catch (e) {
    res.status(200).end();
  }
});

notifyRouter.post("/whatsapp/webhook", async (req, res) => {
  try {
    const body = req.body || {};
    await notificationLogModel.create({ subscriptionId: "", productId: "", channel: "whatsapp", status: "webhook", meta: body, timestamp: Date.now() });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

export default notifyRouter;
