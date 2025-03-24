import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { IWishlist } from '../types';
import { authenticateJWT } from './authRoutes';

const router = express.Router();
const { WishlistSchema } = require('../models/Schema');

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('wishlists', WishlistSchema);


router.post("/", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { title, image, price, pathname, uid } = req.body;

    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only add items to your own wishlist" });
        return;
    }
    
    try {
        const wishlist = new Wishlist({ title, image, price, pathname, uid });
        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        console.error("Error saving wishlist item:", error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});


router.get("/:uid", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;
    
    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only view your own wishlist" });
        return;
    }
    
    try {
        const wishlists = await Wishlist.find({ uid: uid });
        res.status(200).json(wishlists);
    } catch (error) {
        console.error("Error fetching wishlists by uid:", error);
        res.status(500).json({ error: "Failed to fetch wishlists" });
    }
});


router.delete("/:id", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {

        const item = await Wishlist.findByIdAndDelete(id);
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        
        const user = req.body.user;
        if (item.uid !== user.userId) {
            res.status(403).json({ error: "Unauthorized: You can only delete items from your own wishlist" });
            return;
        }
        
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error("Error removing wishlist item:", error);
        res.status(500).json({ error: 'Failed to remove item from wishlist' });
    }
});

export default router;