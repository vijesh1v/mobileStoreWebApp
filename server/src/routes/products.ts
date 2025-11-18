import express, { Request, Response } from 'express';
import db from '../db/database';

const router = express.Router();

// Get all products with filters, sorting, and pagination
router.get('/', (req: Request, res: Response) => {
  try {
    const {
      brand,
      minPrice,
      maxPrice,
      storage,
      color,
      search,
      platform,
      sort = 'name',
      order = 'ASC',
      page = '1',
      limit = '20'
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    // Apply platform filter (iPhone = Apple, Android = non-Apple)
    if (platform) {
      const platforms = Array.isArray(platform) ? platform : [platform];
      const hasiPhone = platforms.includes('iPhone');
      const hasAndroid = platforms.includes('Android');
      
      // If both are selected, don't apply platform filter (show all)
      if (hasiPhone && hasAndroid) {
        // Skip platform filter - show all products
      } else if (hasiPhone) {
        query += ' AND brand = ?';
        params.push('Apple');
      } else if (hasAndroid) {
        query += ' AND brand != ?';
        params.push('Apple');
      }
    }

    // Apply filters
    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice as string));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice as string));
    }

    if (storage) {
      query += ' AND storage = ?';
      params.push(storage);
    }

    if (color) {
      query += ' AND color LIKE ?';
      params.push(`%${color}%`);
    }

    if (search) {
      query += ' AND (name LIKE ? OR brand LIKE ? OR model LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Validate sort column
    const validSortColumns = ['name', 'price', 'brand', 'created_at'];
    const sortColumn = validSortColumns.includes(sort as string) ? sort : 'name';
    const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = db.prepare(countQuery).get(...params) as { count: number };
    const total = countResult.count;

    // Apply pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const products = db.prepare(query).all(...params);

    // Get unique values for filters
    const brands = db.prepare('SELECT DISTINCT brand FROM products ORDER BY brand').all() as any[];
    const storages = db.prepare('SELECT DISTINCT storage FROM products ORDER BY storage').all() as any[];
    const colors = db.prepare('SELECT DISTINCT color FROM products ORDER BY color').all() as any[];

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        brands: brands.map(b => b.brand),
        storages: storages.map(s => s.storage),
        colors: colors.map(c => c.color)
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

