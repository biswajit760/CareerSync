const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    // Not required because Google OAuth users won't have a password
    select: false // Don't return password in queries by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values (for non-Google users)
  },
  authProvider: {
    type: String,
    required: true,
    enum: ['local', 'google'],
    default: 'local'
  },
  profilePicture: {
    type: String,
    default: function() {
      // Generate default avatar using UI Avatars
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
    }
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  scanCount: {
    type: Number,
    default: 0,
    min: 0
  },
  scanLimit: {
    type: Number,
    default: 5 // Free users get 5 scans per month
  },
  savedJobs: [{
    jobId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: String,
    salary: String,
    url: {
      type: String,
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500
    },
    applicationStatus: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'rejected', 'offer'],
      default: 'saved'
    }
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Note: email and googleId indexes are already created via 'unique: true' in schema
// No need to define them again here

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function() {
  // Only hash password if it's modified (or new)
  if (!this.isModified('passwordHash')) {
    return;
  }
  
  // Only hash if passwordHash exists (Google users won't have it)
  if (this.passwordHash) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) {
    return false; // Google users don't have passwords
  }
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to check if user can perform a scan
UserSchema.methods.canScan = function() {
  if (this.plan === 'premium') {
    return true; // Premium users have unlimited scans
  }
  return this.scanCount < this.scanLimit;
};

// Method to increment scan count
UserSchema.methods.incrementScanCount = async function() {
  this.scanCount += 1;
  await this.save();
};

// Method to reset scan count (call this monthly via cron job)
UserSchema.methods.resetScanCount = async function() {
  this.scanCount = 0;
  await this.save();
};

// Static method to find user by email or googleId
UserSchema.statics.findByCredentials = async function(email) {
  const user = await this.findOne({ email }).select('+passwordHash');
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
