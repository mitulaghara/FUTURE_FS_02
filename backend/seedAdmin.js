/**
 * Admin Seed Script
 * Run: node seedAdmin.js
 * Creates the first admin account if none exists.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// ── ✏️  Change these credentials as needed ──────────────────────────────────
const ADMIN_EMAIL    = 'admin@crm.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME     = 'Super Admin';
// ────────────────────────────────────────────────────────────────────────────

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';

async function seedAdmin() {
  try {
    await mongoose.connect(dbUri);
    console.log('✅  Connected to MongoDB');

    const count = await User.countDocuments();

    if (count > 0) {
      console.log('⚠️   An admin account already exists.');
      console.log('    If you want to reset it, drop the "users" collection first.');
      process.exit(0);
    }

    const admin = new User({
      email:    ADMIN_EMAIL,
      password: ADMIN_PASSWORD,   // will be hashed automatically by pre-save hook
      name:     ADMIN_NAME,
    });

    await admin.save();

    console.log('');
    console.log('🎉  Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log(`   Name     : ${ADMIN_NAME}`);
    console.log('─────────────────────────────────────');
    console.log('   Use these credentials to log in at  POST /api/auth/login');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌  Error creating admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
