const mongoose = require("mongoose");

const connectDB = async (mongoURI) => {
  try {
    const conn = await mongoose.connect(mongoURI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;