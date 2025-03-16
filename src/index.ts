import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// Import route handlers
import wishlistRoutes from  './routes/wishlistRoutes';
import cartRoutes from  './routes/cartRoutes';
import infoAccountRoutes from  './routes/infoAccountRoutes';
import checkOutRoutes from  './routes/checkOutCartRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Middleware
app.use(express.json());
app.use(cors());

if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}
mongoose.connect(mongoURI, {
    dbName: dbName,
}).catch(error => console.log(error));

// Routes
app.use('/add-wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/info-account', infoAccountRoutes);
app.use('/check-out', checkOutRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send("App is Working");
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});




  // "scripts": {
  //   "test": "echo \"Error: no test specified\" && exit 1",
  //   "start": "nodemon src/index.ts",
  //   "dev": "ts-node src/index.ts",
  //   "build": "tsc"
  // },