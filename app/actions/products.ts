'use server';

import { promises as fs } from 'fs';
import path from 'path';

// Type definitions
export interface Product {
  id: number;
  title?: string;
  name?: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const PRODUCTS_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(PRODUCTS_DIR, 'products.json');

// Seed data used the first time `data/products.json` is created.
const defaultProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    category: "men's clothing",
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts ',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight and soft fabric for breathable comfort.',
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    category: "men's clothing",
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description:
      'Great outerwear jacket for Spring/Autumn/Winter and suitable for work, hiking, camping, cycling, traveling and other outdoor use.',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
    category: "men's clothing",
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    price: 15.99,
    description:
      'Please note body builds vary by person, so detailed size information should be reviewed before purchase.',
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png',
    category: "men's clothing",
    rating: { rate: 2.1, count: 430 },
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold and Silver Dragon Bracelet",
    price: 695,
    description:
      'From the Legends collection, inspired by the mythical water dragon that protects the ocean pearl.',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
    category: 'jewelery',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    description: 'Delicate ring design with premium polish and long-lasting finish.',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png',
    category: 'jewelery',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 7,
    title: 'White Gold Plated Princess',
    price: 9.99,
    description: 'Classic wedding and engagement style ring designed for daily wear.',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png',
    category: 'jewelery',
    rating: { rate: 3, count: 400 },
  },
  {
    id: 8,
    title: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
    price: 10.99,
    description: 'Rose-gold plated double flared tunnel plug earrings in stainless steel.',
    image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png',
    category: 'jewelery',
    rating: { rate: 1.9, count: 100 },
  },
  {
    id: 9,
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    price: 64,
    description: 'Portable external hard drive with USB 3.0/2.0 compatibility and fast transfers.',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png',
    category: 'electronics',
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 10,
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    price: 109,
    description: 'Faster boot and app load times with balanced performance and reliability.',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png',
    category: 'electronics',
    rating: { rate: 2.9, count: 470 },
  },
];

async function ensureProductsFile() {
  await fs.mkdir(PRODUCTS_DIR, { recursive: true });

  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), 'utf8');
  }
}

function sanitizeProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const source = item as Partial<Product>;
      return {
        id: Number(source.id),
        title: source.title,
        name: source.name,
        price: Number(source.price),
        description: String(source.description ?? ''),
        image: String(source.image ?? ''),
        category: source.category,
        rating: source.rating
          ? {
              rate: Number(source.rating.rate),
              count: Number(source.rating.count),
            }
          : undefined,
      } as Product;
    })
    .filter((product) => Number.isFinite(product.id) && Number.isFinite(product.price));
}

async function readProducts(): Promise<Product[]> {
  await ensureProductsFile();

  try {
    const file = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return sanitizeProducts(JSON.parse(file) as unknown);
  } catch {
    return [...defaultProducts];
  }
}

async function writeProducts(products: Product[]) {
  await ensureProductsFile();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

// Get all products
export async function getAllProducts() {
  const products = await readProducts();
  return {
    success: true,
    data: products,
    count: products.length,
  };
}

// Get single product by ID
export async function getProductById(id: number | string) {
  const products = await readProducts();
  const product = products.find((p) => p.id === parseInt(String(id), 10));

  if (!product) {
    return {
      success: false,
      message: 'Product not found',
    };
  }

  return {
    success: true,
    data: product,
  };
}

// Fetch products
export async function fetchProducts() {
  try {
    const result = await getAllProducts();
    return { data: result, success: result.success };
  } catch (e) {
    console.log('error in fetchProducts', e);
    return { success: false };
  }
}

// Fetch single product by ID (calls API route)
export async function fetchProductById(id: string | number): Promise<ApiResponse<Product>> {
  return await getProductById(id);
}

// Create a new product
export async function createProduct(productData: {
  title: string;
  price: number;
  description: string;
  image: string;
  category?: string;
}) {
  try {
    if (!productData.title || !productData.price || !productData.description || !productData.image) {
      return {
        success: false,
        message: 'Missing required fields: title, price, description, and image are required',
      };
    }

    if (isNaN(productData.price) || productData.price < 0) {
      return {
        success: false,
        message: 'Price must be a valid positive number',
      };
    }

    const products = await readProducts();

    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      title: productData.title,
      price: productData.price,
      description: productData.description,
      image: productData.image,
      category: productData.category || 'Uncategorized',
      rating: { rate: 0, count: 0 },
    };

    products.push(newProduct);
    await writeProducts(products);

    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create product',
      error: String(error),
    };
  }
}

// Update an existing product
export async function updateProduct(
  id: number | string,
  updateData: Partial<{
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
  }>
) {
  try {
    const products = await readProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(String(id), 10));

    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    const updatedProduct = {
      ...products[productIndex],
      ...updateData,
    };

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update product',
      error: String(error),
    };
  }
}

// Delete a product
export async function deleteProduct(id: number | string) {
  try {
    const products = await readProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(String(id), 10));

    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProducts(products);

    return {
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete product',
      error: String(error),
    };
  }
}