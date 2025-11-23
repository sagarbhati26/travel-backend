const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingById,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");


router.post("/", protect, createBooking);


router.get("/my", protect, getUserBookings);


router.get("/:id", protect, getBookingById);


router.delete("/:id", protect, cancelBooking);

module.exports = router;