import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Regular expression for email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password strength criteria
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format.' });
        }

        // Check if email is already registered
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already in use.' });
        }

        // Validate password strength
        if (!passwordStrengthRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long, with an uppercase letter, a number, and a special character.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send the token back to the frontend
        res.status(201).json({
            success: true,
            message: 'User created successfully. You are now logged in.',
            token: token,  // Send the token in the response
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup Error:', error.message);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found. Check your email address.' });
        }

        // Compare plain text password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password. Please try again.' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send both token and userId in response
        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            token,
            userId: user._id // Send the userId along with the token
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
};


export const getUserBookedEvents = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
  
    // Get the current local date (server's local time)
    const currentDate = new Date();
  
    try {
      console.log(req.user);
  
      // Find the authenticated user based on req.user._id
      const user = await User.findById(req.user.userId).populate('bookedEvents');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Filter upcoming events
      const upcomingEvents = user.bookedEvents.filter(
        (event) => new Date(event.date) >= currentDate
      );
  
      // Sort the upcoming events by date in ascending order
      const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Pagination
      const startIndex = (page - 1) * limit;
      const paginatedEvents = sortedEvents.slice(
        startIndex,
        startIndex + parseInt(limit)
      );
  
      res.status(200).json({
        message: 'User upcoming events fetched successfully',
        total: sortedEvents.length,
        page: parseInt(page),
        limit: parseInt(limit),
        events: paginatedEvents,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user events', error: err.message });
    }
  };
  