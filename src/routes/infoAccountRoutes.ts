import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { IAddressInfo } from '../types';
const router = express.Router();
const { InfoAccountSchema } = require('../models/Schema');

const InfoAccountList: Model<IAddressInfo> = mongoose.model<IAddressInfo>('infoAccountLists', InfoAccountSchema);

    router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, country,company,street,apt,city,state,number,postalCode,instruction,shipping,billing, uid } = req.body;
    console.log("Request body:", req.body);

    try {
        const infoAccountList = new InfoAccountList({ firstName, lastName, country,company,street,apt,city,state,number,postalCode,instruction,shipping,billing, uid });
        await infoAccountList.save();
        res.status(201).json(infoAccountList);
    } catch (error) {
        console.error("Error saving infoAccountList item:", error); // Log the error to see more details
        res.status(500).json({ error: "Failed to add to infoAccountList" });
    }
    });

    router.get("/:uid", async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;

    try {
        const accounts = await InfoAccountList.find({ uid: uid });
        res.status(200).json(accounts);
    } catch (error) {
        console.error("Error fetching accounts by uid:", error);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
    });

    router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the item ID from the request parameters

    try {
        const deletedItem = await InfoAccountList.findByIdAndDelete(id); // This removes the item by its ID
        if (!deletedItem) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json({ message: 'Item removed from InfoAccountList' });
    } catch (error) {
        console.error("Error removing InfoAccountList item:", error);
        res.status(500).json({ error: 'Failed to remove item from InfoAccountList' });
    }
    });

    router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the `id` from the request parameters
    const updateData = req.body; // Get the data to update

    try {
        // Log id and update data for debugging
        console.log("Updating document with ID:", id);
        console.log("Update Data:", updateData);

        // Validate the id format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
        }

        // No need to manually convert `id` to ObjectId
        const updatedInfo = await InfoAccountList.findByIdAndUpdate(
        id, // Mongoose will automatically cast the string `id` to ObjectId
        updateData,
        { new: true, upsert: false } // Return the updated document
        );

        if (updatedInfo) {
        res.status(200).json(updatedInfo); // Successfully updated
        } else {
        res.status(404).json({ error: "Document not found" }); // Document not found
        }
    } catch (error) {
        console.error("Error updating document:", error); // Log the error
        res.status(500).json({ error: "Failed to update document" }); // Return 500 if something goes wrong
    }
    });

    export default router;