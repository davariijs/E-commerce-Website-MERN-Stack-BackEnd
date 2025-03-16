import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import serverless from 'serverless-http';
// Import route handlers
import wishlistRoutes from '../../src/routes/wishlistRoutes';
import cartRoutes from '../../src/routes/cartRoutes';
import infoAccountRoutes from '../../src/routes/infoAccountRoutes';
import checkOutRoutes from '../../src/routes/checkOutCartRoutes';

// Load environment variables
require('dotenv').config();

const app = express();
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}
mongoose.connect(mongoURI, {
    dbName: dbName,
}).catch(error => console.log(error));

// Routes - Add /api prefix
app.use('/api/add-wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/info-account', infoAccountRoutes);
app.use('/api/check-out', checkOutRoutes);

// Root route
app.get('/api', (req: Request, res: Response) => {
    res.send("API is Working");
});

// Export the serverless function
export const handler = serverless(app);