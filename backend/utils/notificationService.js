import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import subscriptionModel from "../models/subscriptionModel.js";
import notificationLogModel from "../models/notificationLogModel.js";

const brand = process.env.BRAND_NAME || "Priwar Collection";
const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:5000";
const rateLimitHours = Number(process.env.NOTIFY_RATE_LIMIT_HOURS || 24);
const dryRun = process.env.NOTIFY_DRY_RUN === "true";

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
};

const unsubscribeToken = (subscriptionId) => {
  return jwt.sign({ sid: subscriptionId }, process.env.JWT_SECRET);
};

const shouldRateLimit = (sub) => {
  const now = Date.now();
  const ms = rateLimitHours * 60 * 60 * 1000;
  return sub.lastNotifiedAt && (now - sub.lastNotifiedAt) < ms;
};

const emailTemplate = (product, unsubscribeUrl, lang, sid) => {
  const subject = `${product.name} is back in stock`;
  const text = `${product.name} is now available.\nPrice: ${product.price}\nView: ${appBaseUrl}/product/${product._id}\nUnsubscribe: ${unsubscribeUrl}`;
  const img = product.image && product.image.length ? `<img src="${product.image[0]}" alt="${product.name}" style="max-width:100%;height:auto"/>` : "";
  const trackingPixel = `<img src="${appBaseUrl}/api/notify/track/open?sid=${sid}" width="1" height="1" alt="">`;
  const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>${brand}</h2>
    <h3>${product.name} is back in stock</h3>
    ${img}
    <p>Price: ${product.price}</p>
    <p><a href="${appBaseUrl}/product/${product._id}">View product</a></p>
    <p style="font-size:12px;color:#666">If you no longer wish to receive these notifications, <a href="${unsubscribeUrl}">unsubscribe</a>.</p>
  </div>
  ${trackingPixel}
  `;
  return { subject, text, html };
};

const sendEmail = async (sub, product) => {
  if (!sub.email) return { ok: false, error: "no-email" };
  const tr = smtpTransport();
  const token = unsubscribeToken(sub._id);
  const unsubscribeUrl = `${appBaseUrl}/api/notify/unsubscribe?token=${token}`;
  const tpl = emailTemplate(product, unsubscribeUrl, sub.preferredLanguage || "en", sub._id.toString());
  if (dryRun || !tr) return { ok: true, id: "dry-email" };
  const info = await tr.sendMail({
    from: `${brand} <${process.env.SMTP_FROM || sub.email}>`,
    to: sub.email,
    subject: tpl.subject,
    text: tpl.text,
    html: tpl.html
  });
  return { ok: true, id: info.messageId || "sent" };
};

const sendWhatsApp = async (sub, product) => {
  if (!sub.phone || !sub.channels?.whatsapp) return { ok: false, error: "no-phone" };
  const token = process.env.WABA_TOKEN;
  const phoneNumberId = process.env.WABA_PHONE_NUMBER_ID;
  if (dryRun || !token || !phoneNumberId) return { ok: true, id: "dry-whatsapp" };
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const imageLink = product.image && product.image.length ? product.image[0] : null;
  let payload;
  if (imageLink) {
    payload = {
      messaging_product: "whatsapp",
      to: sub.phone,
      type: "image",
      image: { link: imageLink, caption: `${product.name} is back in stock. Price: ${product.price}` }
    };
  } else {
    payload = {
      messaging_product: "whatsapp",
      to: sub.phone,
      type: "text",
      text: { body: `${product.name} is back in stock. Price: ${product.price}. ${appBaseUrl}/product/${product._id}` }
    };
  }
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: JSON.stringify(data) };
  const id = data.messages && data.messages[0] ? data.messages[0].id : "sent";
  return { ok: true, id };
};

export const triggerBackInStock = async (product, prevStatus) => {
  if (!product || product.inventoryStatus !== "In Stock") return;
  const subs = await subscriptionModel.find({ productId: product._id.toString(), active: true }).lean();
  for (const sub of subs) {
    if (shouldRateLimit(sub)) continue;
    if (sub.channels?.email) {
      try {
        const r = await sendEmail(sub, product);
        await notificationLogModel.create({ subscriptionId: sub._id.toString(), productId: product._id.toString(), channel: "email", status: r.ok ? "sent" : "failed", messageId: r.id || "", error: r.error || "" });
      } catch (e) {
        await notificationLogModel.create({ subscriptionId: sub._id.toString(), productId: product._id.toString(), channel: "email", status: "error", error: e.message });
      }
    }
    if (sub.channels?.whatsapp) {
      try {
        const r = await sendWhatsApp(sub, product);
        await notificationLogModel.create({ subscriptionId: sub._id.toString(), productId: product._id.toString(), channel: "whatsapp", status: r.ok ? "sent" : "failed", messageId: r.id || "", error: r.error || "" });
      } catch (e) {
        await notificationLogModel.create({ subscriptionId: sub._id.toString(), productId: product._id.toString(), channel: "whatsapp", status: "error", error: e.message });
      }
    }
    await subscriptionModel.findByIdAndUpdate(sub._id, { lastNotifiedAt: Date.now(), lastNotifiedStatus: "In Stock" });
  }
};

export const unsubscribeByToken = async (token) => {
  const d = jwt.verify(token, process.env.JWT_SECRET);
  if (!d?.sid) return false;
  await subscriptionModel.findByIdAndUpdate(d.sid, { active: false });
  return true;
};
