// This line MUST be the very first line of your server.js file.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SupportTicket = require('./models/SupportTicket');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB Database ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Basic Admin Authentication Middleware ---
// For demonstration: Checks for a simple 'adminToken' in headers
// In a real app, this would be a JWT token validated on the server.
const authenticateAdmin = (req, res, next) => {
    const token = req.headers['x-admin-token']; // Expect token in 'x-admin-token' header

    // IMPORTANT: For a real app, you'd validate a proper JWT token here,
    // not just check if a simple string exists.
    if (token === process.env.ADMIN_TOKEN_SECRET) { // Using a simple shared secret for now
        next(); // User is authenticated, proceed to the route
    } else {
        res.status(401).json({ message: 'Unauthorized: Admin access required.' });
    }
};

// --- API Routes ---

// NEW: Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    // For demonstration: Simple hardcoded check or use env variables
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // In a real app, you'd generate a JWT token here
        const adminToken = process.env.ADMIN_TOKEN_SECRET || 'supersecretadmintoken'; // A simple secret for now
        res.status(200).json({ message: 'Login successful!', token: adminToken });
    } else {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
});


// Route to handle new support ticket submissions (POST request)
// No admin authentication needed for public form submission
app.post('/api/tickets', async (req, res) => {
    try {
        const { name, email, employeeId, category, subject, description } = req.body;

        const newTicket = new SupportTicket({
            name,
            email,
            employeeId,
            category,
            subject,
            description
        });

        await newTicket.save();
        res.status(201).json({ message: 'Support ticket submitted successfully!', ticket: newTicket });
    } catch (error) {
        console.error('Error submitting ticket:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
        }

        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Route to get all support tickets (GET request - PROTECTED by authenticateAdmin)
// Use the middleware to protect this route
app.get('/api/tickets', authenticateAdmin, async (req, res) => { // <-- Middleware added here!
    try {
        const tickets = await SupportTicket.find().sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Route to update ticket status (PATCH request - PROTECTED by authenticateAdmin)
app.patch('/api/tickets/:id/status', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedTicket = await SupportTicket.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket status updated successfully', ticket: updatedTicket });
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Route to get ticket statistics (GET request - PROTECTED by authenticateAdmin)
app.get('/api/tickets/stats', authenticateAdmin, async (req, res) => {
    try {
        const totalTickets = await SupportTicket.countDocuments();
        const openTickets = await SupportTicket.countDocuments({ status: 'Open' });
        const inProgressTickets = await SupportTicket.countDocuments({ status: 'In Progress' });
        const resolvedTickets = await SupportTicket.countDocuments({ status: 'Resolved' });
        const closedTickets = await SupportTicket.countDocuments({ status: 'Closed' });

        // Get tickets by category
        const categoryStats = await SupportTicket.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent tickets (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentTickets = await SupportTicket.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            total: totalTickets,
            open: openTickets,
            inProgress: inProgressTickets,
            resolved: resolvedTickets,
            closed: closedTickets,
            recent: recentTickets,
            byCategory: categoryStats
        });
    } catch (error) {
        console.error('Error fetching ticket statistics:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Simple root route to confirm server is running
app.get('/', (req, res) => {
    res.send('SFA 2.0 Help Desk Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});