require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found in environment variables' : 'Not found in environment variables');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Successfully connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('PERA System API is running');
});

// Temporary route to create a test admin user (remove in production)
app.get('/create-test-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Check if test admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pera.com' });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Test admin already exists',
        user: {
          email: existingAdmin.email,
          password: 'admin123' // This is the default password
        }
      });
    }
    
    // Create test admin
    const admin = new User({
      name: 'Test Admin',
      email: 'admin@pera.com',
      password: 'admin123',
      role: 'admin',
      designation: 'System Administrator'
    });
    
    await admin.save();
    
    res.status(201).json({
      message: 'Test admin created successfully',
      user: {
        email: admin.email,
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Error creating test admin:', error);
    res.status(500).json({ 
      message: 'Error creating test admin',
      error: error.message 
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const requisitionRoutes = require('./routes/requisitions');
// const resourceRoutes = require('./routes/resources');
// const siteRoutes = require('./routes/sites');

// File upload middleware
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/requisitions', requisitionRoutes);
// app.use('/api/resources', resourceRoutes);
// app.use('/api/sites', siteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
