import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// Import route handlers
import wishlistRoutes from  './routes/wishlistRoutes';
import cartRoutes from  './routes/cartRoutes';
import infoAccountRoutes from  './routes/infoAccountRoutes';
import checkOutRoutes from  './routes/checkOutCartRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Middleware
app.use(express.json());

app.options('*', cors());

app.use(cors({
  origin: ['https://shoply-clothes.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}
mongoose.connect(mongoURI, {
    dbName: dbName,
}).catch(error => console.log(error));

// Routes
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/info-account', infoAccountRoutes);
app.use('/api/check-out', checkOutRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send("App is Working");
});

// Start the server
// app.listen(PORT, () => {
//     console.log(`App is listening on port ${PORT}`);
// });
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
}


export default app;