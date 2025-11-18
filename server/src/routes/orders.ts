import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import db from '../db/database';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Get user's orders
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const orders = db.prepare(`
      SELECT 
        o.id,
        o.total,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.created_at,
        (
          SELECT json_group_array(
            json_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'name', p.name,
              'brand', p.brand,
              'model', p.model,
              'image_url', p.image_url
            )
          )
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) as items
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(userId) as any[];

    // Parse JSON items
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));

    res.json(ordersWithItems);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const order = db.prepare(`
      SELECT 
        o.id,
        o.total,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.created_at
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `).get(id, userId) as any;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = db.prepare(`
      SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name,
        p.brand,
        p.model,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(id) as any[];

    res.json({
      ...order,
      items
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

