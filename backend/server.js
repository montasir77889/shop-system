require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoices');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(cors());          // allow the React app (different port) to call this API
app.use(express.json());  // parse incoming JSON request bodies

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
