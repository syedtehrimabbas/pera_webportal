require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  designation: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Create admin user
async function createAdminUser() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pera.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email: admin@pera.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    // Create new admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@pera.com',
      password: 'admin123',
      role: 'admin',
      designation: 'System Administrator'
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@pera.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
