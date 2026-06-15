/**
 * Create New Admin User Script
 * Run: node createUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// ── New User Credentials ─────────────────────────────────────────────────────
const NEW_EMAIL    = 'admin@crm.com';
const NEW_PASSWORD = 'Admin@1234';
const NEW_NAME     = 'Admin';
// ────────────────────────────────────────────────────────────────────────────

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';

async function createUser() {
  try {
    await mongoose.connect(dbUri);
    console.log('✅  Connected to MongoDB');

    // Check if email already exists
    const existing = await User.findOne({ email: NEW_EMAIL });
    if (existing) {
      console.log(`⚠️   User with email "${NEW_EMAIL}" already exists!`);
      process.exit(0);
    }

    const user = new User({
      email:    NEW_EMAIL,
      password: NEW_PASSWORD,  // auto-hashed by pre-save hook
      name:     NEW_NAME,
    });

    await user.save();

    console.log('');
    console.log('🎉  New user created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Email    : ${NEW_EMAIL}`);
    console.log(`   Password : ${NEW_PASSWORD}`);
    console.log(`   Name     : ${NEW_NAME}`);
    console.log('─────────────────────────────────────');
    console.log('   Login at:  POST /api/auth/login');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  }
}

createUser();
