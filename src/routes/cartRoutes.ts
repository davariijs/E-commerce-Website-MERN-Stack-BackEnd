import express, { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { ICartList } from '../types';
import { authenticateJWT } from './authRoutes';
const { CartSchema } = require('../models/Schema');
const router = express.Router();

const CartCheckList: Model<ICartList> = mongoose.model<ICartList>('cartCheckLists', CartSchema);

router.post("/", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { uid, item } = req.body;

    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only add items to your own cart" });
        return;
    }
  
    try {
      let cart = await CartCheckList.findOne({ uid });
  
      if (!cart) {
        cart = new CartCheckList({ uid, items: [] });
      }
  
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.webID === item.webID && cartItem.color === item.color
      );
  
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        cart.items.push({
          title: item.title,
          image: item.image,
          price: item.price,
          color: item.color,
          quantity: item.quantity || 1,
          webID: item.webID, 
        });
      }
  
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Failed to add product to cart", error });
    }
  });
  
  // GET: Retrieve cart
  // router.get('/:uid', authenticateJWT, async (req: Request, res: Response): Promise<void> => { // Change from userId to uid
  //   const cart = await CartCheckList.findOne({ uid: req.params.uid });
  //   res.status(200).json(cart);
  // });

  // GET: Retrieve cart
  router.get('/:uid', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedUserId = req.body.user.userId;
      if (authenticatedUserId !== req.params.uid) {
        res.status(403).json({ 
          error: "Unauthorized: You can only access your own cart" 
        });
        return;
      }
      const cart = await CartCheckList.findOne({ uid: req.params.uid });
      
      if (!cart) {
        res.status(200).json(null); 
        return;
      }
      
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });
  
  // PUT: Increase item quantity in cart
  router.put('/increase/:uid/:itemId', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { uid, itemId } = req.params;
    

    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only update items to your own cart" });
        return;
    }
    try {
        const cart = await CartCheckList.findOne({ uid });
  
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
          }
  
        const id = new mongoose.Types.ObjectId(itemId);
        const item = cart.items.find((item) => item._id.equals(id));
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
          }
  
        item.quantity += 1; 
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
  router.put('/decrease/:uid/:itemId', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { uid, itemId } = req.params;
    
    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only update items to your own cart" });
        return;
    }
    try {
        const cart = await CartCheckList.findOne({ uid });
  
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
          }
  
        const id = new mongoose.Types.ObjectId(itemId);
  
        const item = cart.items.find((item) => item._id.equals(id));
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
          }
  
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
  router.delete('/:uid/:id', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { uid, id } = req.params;
    

    const user = req.body.user;
    if (user.userId !== uid) {
        res.status(403).json({ error: "Unauthorized: You can only delete items from your own cart" });
        return;
    }

    try {
      console.log(`Deleting item with id: ${id} from cart of user: ${uid}`);
  
      const cart = await CartCheckList.findOne({ uid });
  
      if (!cart) {
        console.log(`No cart found for user: ${uid}`);
        res.status(404).json({ message: 'Cart not found' });
        return;
      }

      console.log(`Cart items before filtering: ${JSON.stringify(cart.items)}`);
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`Invalid ObjectId: ${id}`);
        res.status(400).json({ message: 'Invalid item ID' });
        return;
      }

      const itemId = new mongoose.Types.ObjectId(id);
      const itemExists = cart.items.some((item) => item._id.equals(itemId));
      if (!itemExists) {
        console.log(`Item with id: ${itemId} not found in cart items.`);
        res.status(404).json({ message: 'Item not found in cart' });
        return;

      }

      cart.items = cart.items.filter((item) => !item._id.equals(itemId));
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


  router.delete('/:id', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log('Backend id:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid cart ID" });
        return;
    }

    try {
        const updatedCart = await CartCheckList.findByIdAndUpdate(
            id,
            { $set: { items: [] } }, 
            { new: true }
        );

        if (!updatedCart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        const user = req.body.user;
        if (updatedCart.uid !== user.userId) {
            res.status(403).json({ error: "Unauthorized: You can only delete items from your own cart" });
            return;
        }

        res.status(200).json({ message: 'Cart items cleared', cart: updatedCart });
    } catch (error) {
        console.error("Error clearing cart items:", error);
        res.status(500).json({ error: 'Failed to clear cart items' });
    }
});

export default router;