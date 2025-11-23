

const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  isBooked: { type: Boolean, default: false },
});

const tripSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true }, 
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date }, 
    rawDateTime: { type: String },
    departTime: { type: String },
    arriveTime: { type: String },
    price: { type: Number, required: true },
    totalSeats: { type: Number, default: 0 },
    seats: [seatSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;