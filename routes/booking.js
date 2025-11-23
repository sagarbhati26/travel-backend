const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");


router.post("/", protect, createBooking);


router.get("/my", protect, getUserBookings);


router.delete("/:id", protect, cancelBooking);

module.exports = router;