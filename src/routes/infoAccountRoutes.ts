import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { IAddressInfo } from '../types';
import { authenticateJWT } from './authRoutes';
const router = express.Router();
const { InfoAccountSchema } = require('../models/Schema');

const InfoAccountList: Model<IAddressInfo> = mongoose.model<IAddressInfo>('infoAccountLists', InfoAccountSchema);

    router.post("/", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, country,company,street,apt,city,state,number,postalCode,instruction,shipping,billing, uid } = req.body;
    console.log("Request body:", req.body);
    
    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only add Address to your own account." });
        return;
    }

    try {
        const infoAccountList = new InfoAccountList({ firstName, lastName, country,company,street,apt,city,state,number,postalCode,instruction,shipping,billing, uid });
        await infoAccountList.save();
        res.status(201).json(infoAccountList);
    } catch (error) {
        res.status(500).json({ error: "Failed to add to infoAccountList" });
    }
    });

    router.get("/:uid", authenticateJWT,async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;

    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only view your own addresses." });
        return;
    }

    try {
        const accounts = await InfoAccountList.find({ uid: uid });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
    });

    router.delete("/:id", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; 

    try {
        const deletedItem = await InfoAccountList.findByIdAndDelete(id);
        if (!deletedItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        const user = req.body.user;
        if (deletedItem.uid !== user.userId) {
            res.status(403).json({ error: "Unauthorized: You can only delete addresses from your own account" });
            return;
        }

        res.status(200).json({ message: 'Item removed from InfoAccountList' });
    } catch (error) {
        console.error("Error removing InfoAccountList item:", error);
        res.status(500).json({ error: 'Failed to remove item from InfoAccountList' });
    }
    });

    router.put("/:id", authenticateJWT,async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; 
    const updateData = req.body;

    try {

        console.log("Updating document with ID:", id);
        console.log("Update Data:", updateData);

        if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
        }

        const updatedInfo = await InfoAccountList.findByIdAndUpdate(
        id,
        updateData,
        { new: true, upsert: false }
        );

        const user = req.body.user;
        if (updateData.uid !== user.userId) {
            res.status(403).json({ error: "Unauthorized: You can only update addresses from your own account" });
            return;
        }

        if (updatedInfo) {
        res.status(200).json(updatedInfo); 
        } else {
        res.status(404).json({ error: "Document not found" });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Failed to update document" });
    }
    });

    export default router;