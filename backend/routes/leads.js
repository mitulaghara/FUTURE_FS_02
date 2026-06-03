const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// @route   POST api/leads
// @desc    Public webhook to submit a new lead from a website
// @access  Public (Optional API Key security)
router.post('/', async (req, res) => {
  const apiKey = process.env.WEBHOOK_API_KEY;
  if (apiKey) {
    const clientKey = req.headers['x-crm-api-key'];
    if (clientKey !== apiKey) {
      return res.status(401).json({ message: 'Unauthorized webhook request. Invalid API Key.' });
    }
  }

  const { name, email, source, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    const newLead = new Lead({
      name,
      email,
      source: source || 'Website Contact Form',
      status: 'New'
    });

    // If an initial message is submitted, add it as the first note
    if (message && message.trim()) {
      newLead.notes.push({
        content: `Initial Website Message: "${message.trim()}"`
      });
    }

    await newLead.save();
    res.status(201).json({ message: 'Lead captured successfully!', leadId: newLead._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error capturing lead' });
  }
});

// ==========================================
// Admin Protected Routes below
// ==========================================

// @route   GET api/leads
// @desc    Get all leads with filtering, searching, and sorting
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const { status, source, search, sort } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by source
    if (source && source !== 'all') {
      query.source = source;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOptions = { name: -1 };
    }

    const leads = await Lead.find(query).sort(sortOptions);
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving leads' });
  }
});

// @route   GET api/leads/:id
// @desc    Get a single lead by ID
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/leads/:id/status
// @desc    Update a lead's status
// @access  Private (Admin)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  
  if (!['New', 'Contacted', 'Converted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    lead.status = status;

    // Automatically append a system note about status change
    lead.notes.push({
      content: `Status updated from "${oldStatus}" to "${status}"`
    });

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/leads/:id/notes
// @desc    Add a note to a lead
// @access  Private (Admin)
router.post('/:id/notes', auth, async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Note content cannot be empty' });
  }

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.push({ content: content.trim() });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/leads/:id/followups
// @desc    Add a follow-up task to a lead
// @access  Private (Admin)
router.post('/:id/followups', auth, async (req, res) => {
  const { date, note } = req.body;

  if (!date || !note || !note.trim()) {
    return res.status(400).json({ message: 'Follow-up date and note are required' });
  }

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.followUps.push({
      date: new Date(date),
      note: note.trim(),
      completed: false
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/leads/:id/followups/:followupId
// @desc    Toggle completion of a follow-up task
// @access  Private (Admin)
router.patch('/:id/followups/:followupId', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const followup = lead.followUps.id(req.params.followupId);
    if (!followup) {
      return res.status(404).json({ message: 'Follow-up task not found' });
    }

    followup.completed = !followup.completed;
    
    // Log note about follow-up status
    lead.notes.push({
      content: `Follow-up ("${followup.note}") marked as ${followup.completed ? 'completed' : 'incomplete'}`
    });

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete a lead
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
