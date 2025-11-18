import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import db from '../db/database';

const router = express.Router();

// All checkout routes require authentication
router.use(authenticateToken);

// Create order (dummy checkout)
router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { shipping_address, payment_method } = req.body;

    if (!shipping_address || !payment_method) {
      return res.status(400).json({ error: 'Shipping address and payment method are required' });
    }

    // Get user's cart items
    const cartItems = db.prepare(`
      SELECT 
        ci.product_id,
        ci.quantity,
        p.price,
        p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId) as any[];

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ID ${item.product_id}` 
        });
      }
      total += item.price * item.quantity;
    }

    // Create order in transaction
    const createOrder = db.transaction(() => {
      // Insert order
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total, status, shipping_address, payment_method)
        VALUES (?, ?, ?, ?, ?)
      `).run(userId, total, 'pending', shipping_address, payment_method);

      const orderId = orderResult.lastInsertRowid as number;

      // Insert order items and update stock
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      const updateStock = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const item of cartItems) {
        insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
        updateStock.run(item.quantity, item.product_id);
      }

      // Clear cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

      return orderId;
    });

    const orderId = createOrder();

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

