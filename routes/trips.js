const express = require("express");
const router = express.Router();

const {
  createTrip,
  getAllTrips,
  getTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");
const { admin } = require("../middleware/roleMiddleware");


router.get("/", getAllTrips);
router.get("/:id", getTrip);


router.post("/", protect, admin, createTrip);
router.put("/:id", protect, admin, updateTrip);
router.delete("/:id", protect, admin, deleteTrip);

module.exports = router;