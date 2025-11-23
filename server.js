
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const bookingRoutes = require("./routes/booking");

const app = express();
app.use(express.json());



const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

const PORT = process.env.PORT || 8008;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);


app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => res.send("Argo backend running"));

app.use((err, req, res,next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});