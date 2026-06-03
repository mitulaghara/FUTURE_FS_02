const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FollowUpSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  source: {
    type: String,
    required: true,
    trim: true,
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New'
  },
  notes: [NoteSchema],
  followUps: [FollowUpSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
