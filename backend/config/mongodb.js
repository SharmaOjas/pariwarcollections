import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected to avoid redundant connections in serverless environments
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database.");
      return;
    }

    // Event listeners for connection status
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
    });

    // Build connection string: prefer SRV and avoid deprecated options
    const baseUri = process.env.MONGODB_URI || ''
    const hasDbInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(baseUri)
    const connUri = hasDbInUri ? baseUri : `${baseUri}/e-commerce`
    await mongoose.connect(connUri)

  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export default connectDB;
