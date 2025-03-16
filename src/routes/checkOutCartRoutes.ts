import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { ICheckOut } from '../types';
const router = express.Router();
const { CheckOutSchema } = require('../models/Schema');

const CheckOutList: Model<ICheckOut>= mongoose.model<ICheckOut>('check-out', CheckOutSchema);

    router.post("/", async (req: Request, res: Response): Promise<void> => {
        const { uid, orders } = req.body;

        // Validate request body
        if (!uid || !orders || !Array.isArray(orders)) {
            res.status(400).json({ message: "Invalid request body. 'uid' and 'orders' are required." });
            return;
        }

        try {
            // Find the user's CheckOutList by UID
            let checkOut = await CheckOutList.findOne({ uid });

            if (!checkOut) {
                // If no CheckOutList exists for the user, create a new one
                checkOut = new CheckOutList({ uid, orders: [] });
            }

            // Add the new orders to the user's checkout list
            checkOut.orders = [...checkOut.orders, ...orders];

            // Save the updated checkout list to the database
            await checkOut.save();

            res.status(200).json({
                message: "Order successfully added to your dashboard",
                checkOut: checkOut, // Return the entire updated checkout list
            });
        } catch (error) {
            console.error("Failed to process order:", error);
            res.status(500).json({ message: "Failed to process order", error });
        }
    });



    router.get('/:uid', async (req: Request, res: Response): Promise<void> => { 
        try {
            const checkOutOrder = await CheckOutList.findOne({ uid: req.params.uid });
            res.status(200).json(checkOutOrder);
            } catch (error) {
            res.status(500).json({ error: "Failed to fetch order" });
            }
    });

    export default router;