const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
  weaponType: {
    type: String,
    required: true,
    enum: ['AK-47', 'Beretta', 'Pistol', 'Rifle', 'Other']
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'under_maintenance', 'damaged', 'decommissioned'],
    default: 'available'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  purchaseDate: {
    type: Date,
    required: true
  },
  notes: String,
  currentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster search on serial number and status
weaponSchema.index({ serialNumber: 1 }, { unique: true });
weaponSchema.index({ status: 1 });

module.exports = mongoose.model('Weapon', weaponSchema);
