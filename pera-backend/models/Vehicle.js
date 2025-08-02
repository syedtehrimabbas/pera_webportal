const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Double Cabin', 'Single Cabin', 'Bike', 'Jeep', 'Car', 'Van', 'Other']
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'in_use', 'under_maintenance', 'out_of_service'],
    default: 'available'
  },
  currentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  odometerReading: {
    type: Number,
    default: 0
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid', 'other'],
    required: true
  },
  fuelEfficiency: Number, // km per liter
  insuranceDetails: {
    policyNumber: String,
    provider: String,
    expiryDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Index for faster search on registration number and status
vehicleSchema.index({ registrationNumber: 1 }, { unique: true });
vehicleSchema.index({ status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
