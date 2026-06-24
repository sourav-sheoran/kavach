const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cron = require('node-cron');
const connectDB = require('./config/db');
const { seedStations, seedInbox } = require('./services/seed.service');
const { fetchAndStore } = require('./services/news.service');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/identity', require('./routes/identity.routes'));
app.use('/api/inbox', require('./routes/inbox.routes'));
app.use('/api/station', require('./routes/station.routes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'KAVACH Server Running ✅' });
});

// Serve Frontend for all other routes
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ KAVACH Server running on port ${PORT}`);

  // Seed initial data
  await seedStations();
  await seedInbox();

  // Fetch real news on startup
  await fetchAndStore();

  // Cron job - fetch news every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Cron: Fetching latest news...');
    await fetchAndStore();
  });
});