const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  operationType: {
    type: String,
    required: true,
    enum: ['surveillance', 'raid', 'inspection', 'other']
  },
  description: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  sensitivity: {
    type: String,
    enum: ['normal', 'sensitive', 'top-secret'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'sdo_approved', 'in_progress', 'completed', 'rejected', 'cancelled'],
    default: 'draft'
  },
  assignedTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  assignedWeapons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weapon'
  }],
  location: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  sdoRemarks: String,
  completionReport: String,
  completedAt: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate request number
requisitionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Requisition').countDocuments();
    this.requestNumber = `REQ-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Requisition', requisitionSchema);
