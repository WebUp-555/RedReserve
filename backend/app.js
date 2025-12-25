import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bloodRequestRoutes from './routes/Bloodrequest.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import donorRoutes from './routes/donor.routes.js';

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/donations', donorRoutes);


export default app;