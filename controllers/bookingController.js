const Booking = require("../models/Booking");
const Trip = require("../models/Trip");


exports.createBooking = async (req, res) => {
  try {
    const { tripId, seats } = req.body; // seats: array of seat numbers
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

  
    const unavailable = seats.filter((s) => {
      const seatObj = trip.seats.find((ss) => ss.seatNumber === s);
      return !seatObj || seatObj.isBooked;
    });
    if (unavailable.length)
      return res.status(400).json({ message: "Seats not available", seats: unavailable });

    
    trip.seats = trip.seats.map((s) => {
      if (seats.includes(s.seatNumber)) s.isBooked = true;
      return s;
    });

    await trip.save();

    const totalAmount = seats.length * trip.price;
    const booking = await Booking.create({
      user: req.user._id,
      trip: trip._id,
      seats,
      totalAmount,
      status: "Confirmed",
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("trip");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("trip");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Not allowed" });

    
    const trip = booking.trip;
    trip.seats = trip.seats.map((s) => {
      if (booking.seats.includes(s.seatNumber)) s.isBooked = false;
      return s;
    });
    await trip.save();

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getBookingById = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("trip").populate("user");
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      res.json(booking);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };