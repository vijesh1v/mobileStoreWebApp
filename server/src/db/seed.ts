import db from './database';

const products = [
  {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    price: 999,
    storage: '128GB',
    color: 'Natural Titanium',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    stock: 50
  },
  {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    price: 1099,
    storage: '256GB',
    color: 'Natural Titanium',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    stock: 30
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    model: 'iPhone 15',
    price: 799,
    storage: '128GB',
    color: 'Blue',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'iPhone 15 with A16 Bionic chip and Dynamic Island.',
    stock: 40
  },
  {
    name: 'iPhone 14',
    brand: 'Apple',
    model: 'iPhone 14',
    price: 699,
    storage: '128GB',
    color: 'Purple',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'iPhone 14 with A15 Bionic chip and improved cameras.',
    stock: 35
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    price: 1199,
    storage: '256GB',
    color: 'Titanium Black',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    description: 'Flagship Samsung phone with S Pen, 200MP camera, and Snapdragon 8 Gen 3.',
    stock: 25
  },
  {
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    model: 'Galaxy S24',
    price: 799,
    storage: '128GB',
    color: 'Marble Gray',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    description: 'Compact flagship with AI features and excellent cameras.',
    stock: 45
  },
  {
    name: 'Samsung Galaxy S23',
    brand: 'Samsung',
    model: 'Galaxy S23',
    price: 699,
    storage: '128GB',
    color: 'Phantom Black',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    description: 'Powerful Android phone with Snapdragon 8 Gen 2.',
    stock: 30
  },
  {
    name: 'Samsung Galaxy A54',
    brand: 'Samsung',
    model: 'Galaxy A54',
    price: 449,
    storage: '128GB',
    color: 'Awesome Violet',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    description: 'Mid-range phone with great cameras and 5G connectivity.',
    stock: 60
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 999,
    storage: '128GB',
    color: 'Obsidian',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    description: 'Google\'s flagship with Tensor G3, advanced AI, and best-in-class camera.',
    stock: 20
  },
  {
    name: 'Google Pixel 8',
    brand: 'Google',
    model: 'Pixel 8',
    price: 699,
    storage: '128GB',
    color: 'Hazel',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    description: 'Compact Pixel with Tensor G3 and excellent photography.',
    stock: 35
  },
  {
    name: 'Google Pixel 7a',
    brand: 'Google',
    model: 'Pixel 7a',
    price: 499,
    storage: '128GB',
    color: 'Sea',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    description: 'Affordable Pixel with flagship camera features.',
    stock: 50
  },
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    price: 799,
    storage: '256GB',
    color: 'Silky Black',
    image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
    description: 'Flagship killer with Snapdragon 8 Gen 3 and fast charging.',
    stock: 30
  },
  {
    name: 'OnePlus 11',
    brand: 'OnePlus',
    model: 'OnePlus 11',
    price: 699,
    storage: '128GB',
    color: 'Titan Black',
    image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
    description: 'Powerful phone with Hasselblad cameras and fast performance.',
    stock: 25
  },
  {
    name: 'OnePlus Nord 3',
    brand: 'OnePlus',
    model: 'Nord 3',
    price: 449,
    storage: '128GB',
    color: 'Misty Green',
    image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
    description: 'Mid-range OnePlus with great value and performance.',
    stock: 40
  },
  {
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Pro',
    price: 899,
    storage: '256GB',
    color: 'Black',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Flagship Xiaomi with Leica cameras and Snapdragon 8 Gen 3.',
    stock: 20
  },
  {
    name: 'Xiaomi 13',
    brand: 'Xiaomi',
    model: 'Xiaomi 13',
    price: 599,
    storage: '128GB',
    color: 'Blue',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Compact flagship with Leica cameras and fast charging.',
    stock: 35
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro',
    price: 349,
    storage: '128GB',
    color: 'Midnight Black',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Budget-friendly phone with great cameras and performance.',
    stock: 70
  },
  {
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    model: 'Phone (2)',
    price: 599,
    storage: '128GB',
    color: 'White',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'Unique transparent design with Glyph interface and Snapdragon 8+ Gen 1.',
    stock: 15
  },
  {
    name: 'Nothing Phone (2a)',
    brand: 'Nothing',
    model: 'Phone (2a)',
    price: 349,
    storage: '128GB',
    color: 'Black',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    description: 'Affordable Nothing phone with unique design and good performance.',
    stock: 40
  },
  {
    name: 'Motorola Edge 40 Pro',
    brand: 'Motorola',
    model: 'Edge 40 Pro',
    price: 699,
    storage: '256GB',
    color: 'Lunar Blue',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Motorola flagship with curved display and fast charging.',
    stock: 25
  },
  {
    name: 'Motorola Moto G84',
    brand: 'Motorola',
    model: 'Moto G84',
    price: 249,
    storage: '128GB',
    color: 'Viva Magenta',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Budget phone with clean Android and good battery life.',
    stock: 80
  },
  {
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    model: 'Xperia 1 V',
    price: 1299,
    storage: '256GB',
    color: 'Black',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'Premium phone for content creators with 4K display and pro cameras.',
    stock: 10
  },
  {
    name: 'OPPO Find X6 Pro',
    brand: 'OPPO',
    model: 'Find X6 Pro',
    price: 899,
    storage: '256GB',
    color: 'Glossy Black',
    image_url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500',
    description: 'OPPO flagship with Hasselblad cameras and fast charging.',
    stock: 20
  }
];

const insertProduct = db.prepare(`
  INSERT INTO products (name, brand, model, price, storage, color, image_url, description, stock)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((products: any[]) => {
  for (const product of products) {
    insertProduct.run(
      product.name,
      product.brand,
      product.model,
      product.price,
      product.storage,
      product.color,
      product.image_url,
      product.description,
      product.stock
    );
  }
});

insertMany(products);

console.log(`Seeded ${products.length} products successfully!`);

db.close();

