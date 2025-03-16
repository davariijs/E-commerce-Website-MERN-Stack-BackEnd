import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { IWishlist } from '../types';
const router = express.Router();
const { WishlistSchema } = require('../models/Schema');

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('wishlists', WishlistSchema);

    router.post("/", async (req: Request, res: Response): Promise<void> => {
        const { title, image, price,pathname, uid } = req.body;
        console.log("Request body:", req.body);
    
        try {
        const wishlist = new Wishlist({ title, image, price, pathname, uid });
        await wishlist.save();
        res.status(201).json(wishlist);
        } catch (error) {
            console.error("Error saving wishlist item:", error); // Log the error to see more details
            res.status(500).json({ error: "Failed to add to wishlist" });
        }
    });

    router.get("/:uid", async (req: Request, res: Response): Promise<void> => {
        const { uid } = req.params;
    
        try {
            const wishlists = await Wishlist.find({ uid: uid });
            res.status(200).json(wishlists);
        } catch (error) {
            console.error("Error fetching wishlists by uid:", error);
            res.status(500).json({ error: "Failed to fetch wishlists" });
        }
    });

    router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params; // Get the item ID from the request parameters

        try {
            const deletedItem = await Wishlist.findByIdAndDelete(id); // This removes the item by its ID
            if (!deletedItem) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.status(200).json({ message: 'Item removed from wishlist' });
        } catch (error) {
            console.error("Error removing wishlist item:", error);
            res.status(500).json({ error: 'Failed to remove item from wishlist' });
        }
    });

    export default router;