import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { ICartList } from '../types';
const { CartSchema } = require('../models/Schema');
const router = express.Router();

const CartCheckList: Model<ICartList> = mongoose.model<ICartList>('cartCheckLists', CartSchema);

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { uid, item } = req.body;
  
    try {
      // Find the cart by user ID
      let cart = await CartCheckList.findOne({ uid });
  
      if (!cart) {
        // If no cart exists for the user, create a new one
        cart = new CartCheckList({ uid, items: [] });
      }
  
      // Check if the item already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.webID === item.webID && cartItem.color === item.color
      );
  
      if (existingItemIndex > -1) {
        // If the item exists, increment its quantity
        cart.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({
          title: item.title,
          image: item.image,
          price: item.price,
          color: item.color,
          quantity: item.quantity || 1, // Default quantity to 1
          webID: item.webID, // Use consistent naming
        });
      }
  
      // Save the cart to the database
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Failed to add product to cart", error });
    }
  });
  
  // GET: Retrieve cart
  router.get('/:uid', async (req: Request, res: Response): Promise<void> => { // Change from userId to uid
    const cart = await CartCheckList.findOne({ uid: req.params.uid });
    res.status(200).json(cart);
  });
  
  // PUT: Increase item quantity in cart
  router.put('/increase/:uid/:itemId', async (req: Request, res: Response): Promise<void> => {
    const { uid, itemId } = req.params;
  
    try {
        const cart = await CartCheckList.findOne({ uid });
  
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
          }
  
        const id = new mongoose.Types.ObjectId(itemId); // Convert to ObjectId
        const item = cart.items.find((item) => item._id.equals(id));
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
          }
  
        item.quantity += 1; // Increment quantity
        await cart.save();
  
        res.status(200).json(cart);
        return;
    } catch (error) {
        console.error("Error increasing item quantity:", error);
        res.status(500).json({ message: 'Failed to increase item quantity' });
        return;
      }
  });
  
  // PUT: Decrease item quantity in cart
  router.put('/decrease/:uid/:itemId', async (req: Request, res: Response): Promise<void> => {
    const { uid, itemId } = req.params;
  
    try {
        const cart = await CartCheckList.findOne({ uid });
  
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
          }
  
        const id = new mongoose.Types.ObjectId(itemId); // Convert to ObjectId
  
        const item = cart.items.find((item) => item._id.equals(id));
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
          }
  
        // Decrease quantity or remove item if quantity is 1
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.items = cart.items.filter((item) => !item._id.equals(id));
        }
  
        await cart.save();
  
        res.status(200).json(cart);
        return;
    } catch (error) {
        console.error("Error decreasing item quantity:", error);
        res.status(500).json({ message: 'Failed to decrease item quantity' });
        return;
    }
  });
  
  
  // DELETE: Remove item from cart
  router.delete('/:uid/:id', async (req: Request, res: Response): Promise<void> => {
    const { uid, id } = req.params;
  
    try {
      console.log(`Deleting item with id: ${id} from cart of user: ${uid}`);
  
      // Find the cart associated with the user ID
      const cart = await CartCheckList.findOne({ uid });
  
      if (!cart) {
        console.log(`No cart found for user: ${uid}`);
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
  
      // Log current items for debugging
      console.log(`Cart items before filtering: ${JSON.stringify(cart.items)}`);
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`Invalid ObjectId: ${id}`);
        res.status(400).json({ message: 'Invalid item ID' });
        return;
      }
      // Convert id from string to ObjectId
      const itemId = new mongoose.Types.ObjectId(id); // Use 'new' here
  
      // Check if the item exists before filtering
      const itemExists = cart.items.some((item) => item._id.equals(itemId)); // Use equals() for comparison
      if (!itemExists) {
        console.log(`Item with id: ${itemId} not found in cart items.`);
        res.status(404).json({ message: 'Item not found in cart' });
        return;

      }
  
      // Filter out the item by its ObjectId
      cart.items = cart.items.filter((item) => !item._id.equals(itemId)); // Use equals() for filtering
  
      // Save the updated cart
      await cart.save();
  
      console.log(`Successfully removed item with id: ${itemId} from user: ${uid}'s cart`);
      res.status(200).json({ message: 'Item removed successfully' });
      return;
    }
     catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ message: 'Failed to remove item from cart' });
      return;

    }
  });


  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log('Backend id:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid cart ID" });
        return;
    }

    try {
        // Update the cart document by setting the items array to an empty array
        const updatedCart = await CartCheckList.findByIdAndUpdate(
            id,
            { $set: { items: [] } }, // Clear the items array
            { new: true } // Return the updated document
        );

        if (!updatedCart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        res.status(200).json({ message: 'Cart items cleared', cart: updatedCart });
    } catch (error) {
        console.error("Error clearing cart items:", error);
        res.status(500).json({ error: 'Failed to clear cart items' });
    }
});

export default router;