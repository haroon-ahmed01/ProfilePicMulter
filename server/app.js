const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3008;

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads')); 

const SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error(`MongoDB connection failed: ${error}`));


  const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  profileImage: {
    type: String,
    validate: {
      validator: (v) => /\.(png|jpg)$/i.test(v), // case insensitive
      message: 'Only .png or .jpg allowed',
    },
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

// Register (email, password, username)
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, username });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});


function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}


app.get('/api/protected', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Welcome to protected page', user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg and .png files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// Update Profile 
app.put('/api/update-profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const { username } = req.body;
    const update = {};

    if (username) update.username = username;
    if (req.file) update.profileImage = req.file.path;

    await User.findByIdAndUpdate(req.user.userId, update);

    res.json({ message: 'Your profile is updated!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Global error handler for multer file upload errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only .jpg and .png files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
