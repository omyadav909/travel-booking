const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinationName: { type: String, required: true },
  travelDate: { type: Date, required: true },
  numberOfTravelers: { type: Number, required: true },
  packageType: { type: String, enum: ['Silver', 'Gold', 'Platinum'], required: true },
  price: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  contactAddress: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);