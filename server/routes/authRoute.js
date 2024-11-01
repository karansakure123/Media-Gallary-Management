import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import User from '../model/userModel.js';

const router = express.Router();
const JWT_SECRET = 'JJAjNadsh123JKHIJHIUJB'; // Replace with your actual secret

// Initialize cookie-parser middleware
router.use(cookieParser());

// Middleware for authenticating users based on JWT
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Access token from cookies
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.userId; // Store user ID from the token
        next();
    });
};

// Route for user registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } = req.body;

  try {
      // Check if all fields are provided
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
      });

      await newUser.save();

      // Generate a token
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

      // Set the token as a cookie
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          maxAge: 3600000, // 1 hour
      });

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Login route with cookie set for token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      // Set the token as a cookie
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          maxAge: 3600000, // 1 hour
      });

      res.status(200).json({ message: 'Logged in successfully',token });
  } catch (error) {
      return res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch user data (protected)
router.get('/mee', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Route for user logout
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the cookie
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
