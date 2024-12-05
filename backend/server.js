const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import CORS

// Load environment variables
dotenv.config();

// Initialize app and connect to database
const app = express();
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Include credentials like cookies
  })
);

// Serve static files for frontend
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/dist/index.html'))
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/book-sets', require('./routes/bookSetRoutes'));
app.use('/api/copies', require('./routes/copyRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
