import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import db from '../db/database';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const cartItems = db.prepare(`
      SELECT 
        ci.id,
        ci.quantity,
        ci.created_at,
        p.id as product_id,
        p.name,
        p.brand,
        p.model,
        p.price,
        p.storage,
        p.color,
        p.image_url,
        p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(userId) as any[];

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id) as any;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingItem = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?')
      .get(userId, product_id) as any;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
        .run(newQuantity, existingItem.id);

      res.json({ message: 'Cart item updated', quantity: newQuantity });
    } else {
      // Insert new item
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)')
        .run(userId, product_id, quantity);

      res.status(201).json({ message: 'Item added to cart' });
    }
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Get cart item
    const cartItem = db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?')
      .get(id, userId) as any;

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check product stock
    const product = db.prepare('SELECT stock FROM products WHERE id = ?')
      .get(cartItem.product_id) as any;

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update quantity
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, id);

    res.json({ message: 'Cart item updated', quantity });
  } catch (error: any) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?')
      .run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

