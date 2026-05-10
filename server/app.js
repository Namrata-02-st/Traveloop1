const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trip.routes');
const stopRoutes = require('./routes/stop.routes');
const { publicRouter: activityRoutes, stopRouter: stopActivityRoutes } = require('./routes/activity.routes');
const cityRoutes = require('./routes/city.routes');
const budgetRoutes = require('./routes/budget.routes');
const packingRoutes = require('./routes/packing.routes');
const notesRoutes = require('./routes/notes.routes');
const shareRoutes = require('./routes/share.routes');
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middleware/error.middleware');
const { error } = require('./utils/responseHelper');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' }, message: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/stops', stopRoutes);
app.use('/api/stops/:stopId/activities', stopActivityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/trips/:tripId/budget', budgetRoutes);
app.use('/api/trips/:tripId/packing', packingRoutes);
app.use('/api/trips/:tripId/notes', notesRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404));
app.use(errorMiddleware);

module.exports = app;
