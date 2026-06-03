import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import censusRoutes from './routes/census.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and CORS configurations
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading files in frontend from backend
}));
app.use(cors());

// Parse application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve document uploads securely
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/census', censusRoutes);
app.use('/api/admin', adminRoutes);

// Fallback Route for API endpoints
app.use('*', (req, res) => {
  res.status(404).json({ message: `API Endpoint not found: ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

export default app;
