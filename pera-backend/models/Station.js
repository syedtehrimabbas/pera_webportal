const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['police_station', 'check_post', 'headquarters', 'regional_office', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    district: String,
    province: {
      type: String,
      enum: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK']
    },
    postalCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  contact: {
    phone: [String],
    email: String,
    emergencyContact: String
  },
  inCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  operationalHours: {
    open: String,
    close: String,
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  facilities: [String],
  notes: String
}, {
  timestamps: true
});

// Create a 2dsphere index for geospatial queries
stationSchema.index({ 'address.coordinates': '2dsphere' });

// Index for faster search on code and name
stationSchema.index({ code: 1 }, { unique: true });
stationSchema.index({ name: 'text' });

module.exports = mongoose.model('Station', stationSchema);
