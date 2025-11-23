const Trip = require("../models/Trip");

async function generateTripCode() {
  const last = await Trip.findOne({}).sort({ createdAt: -1 }).select("code").lean();
  if (!last || !last.code) return "T001";

  const m = last.code.match(/^T(\d+)$/);
  const n = m ? parseInt(m[1], 10) + 1 : null;

  return n ? `T${String(n).padStart(3, "0")}` : "T001";
}


function generateSeats() {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seats = [];

  rows.forEach((row) => {
    for (let i = 1; i <= 6; i++) {
      seats.push({ seatNumber: `${row}${i}`, isBooked: false });
    }
  });

  return seats;
}

exports.createTrip = async (req, res) => {
  try {
    const { from, to, dateTime, price, departTime, arriveTime } = req.body;

    /** Parse date safely */
    let parsedDate = null;
    if (dateTime) {
      const dateMatch = dateTime.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) parsedDate = new Date(dateMatch[1]);
    }

    const code = await generateTripCode();
    const seats = generateSeats(); // ⭐ NEW FIXED SEATS

    const trip = await Trip.create({
      code,
      from,
      to,
      date: parsedDate,
      rawDateTime: dateTime || "",
      departTime: departTime || "",
      arriveTime: arriveTime || "",
      price,
      totalSeats: seats.length,
      seats,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.getAllTrips = async (req, res) => {
//   try {
//     const trips = await Trip.find().sort({ date: 1 });
//     res.json(trips);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getAllTrips = async (req, res) => {
    try {
      const { from, to, date } = req.query;
  
      let filter = {};
  
      if (from) {
        filter.from = { $regex: new RegExp(from, "i") }; 
      }
  
      if (to) {
        filter.to = { $regex: new RegExp(to, "i") };
      }
  
      if (date) {
        filter.rawDateTime = date; 
      }
  
      const trips = await Trip.find(filter).sort({ date: 1 });
  
      res.json(trips);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const allowed = ["from", "to", "date", "departTime", "arriveTime", "price"];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};