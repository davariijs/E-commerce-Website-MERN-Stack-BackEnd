import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { ICheckOut } from '../types';
import { authenticateJWT } from './authRoutes';
const router = express.Router();
const { CheckOutSchema } = require('../models/Schema');

const CheckOutList: Model<ICheckOut>= mongoose.model<ICheckOut>('check-out', CheckOutSchema);

    router.post("/", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
        const { uid, orders } = req.body;

        const user = req.body.user;
        if (user.userId !== uid) {
            res.status(403).json({ error: "Unauthorized: You can only add  & information to your own CheckOut." });
            return;
        }


        if (!uid || !orders || !Array.isArray(orders)) {
            res.status(400).json({ message: "Invalid request body. 'uid' and 'orders' are required." });
            return;
        }

        try {
            let checkOut = await CheckOutList.findOne({ uid });

            if (!checkOut) {
                checkOut = new CheckOutList({ uid, orders: [] });
            }

            checkOut.orders = [...checkOut.orders, ...orders];

            await checkOut.save();

            res.status(200).json({
                message: "Order successfully added to your dashboard",
                checkOut: checkOut,
            });
        } catch (error) {
            console.error("Failed to process order:", error);
            res.status(500).json({ message: "Failed to process order", error });
        }
    });



    router.get('/:uid', authenticateJWT, async (req: Request, res: Response): Promise<void> => { 
        try {
            const authenticatedUserId = req.body.user.userId;
            if (authenticatedUserId !== req.params.uid) {
                res.status(403).json({ 
                error: "Unauthorized: You can only access your own Orders." 
                });
                return;
            }
            
            const checkOutOrder = await CheckOutList.findOne({ uid: req.params.uid });
            res.status(200).json(checkOutOrder);
            } catch (error) {
            res.status(500).json({ error: "Failed to fetch order" });
            }
    });

    export default router;