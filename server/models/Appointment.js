const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  veterinarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  veterinarianName: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  animalType: {
    type: String,
    required: true,
    enum: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry', 'Horse', 'Other']
  },
  animalAge: {
    type: String,
    default: ''
  },
  problem: {
    type: String,
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    required: true,
    enum: ['emergency', 'urgent', 'normal'],
    default: 'normal'
  },
  additionalNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookedByName: {
    type: String,
    required: true
  },
  confirmedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ veterinarianId: 1, status: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ bookedBy: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 