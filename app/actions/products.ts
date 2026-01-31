'use server';

import { headers } from "next/headers";

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

// Manual products data - stored in memory (shared with API route)
const products: Product[] = [
  {
    id: 1,
    title: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://via.placeholder.com/300x300?text=Wireless+Headphones',
    category: 'Electronics',
    rating: { rate: 4.5, count: 128 }
  },
  {
    id: 2,
    title: 'USB-C Cable',
    price: 12.99,
    description: 'Durable USB-C charging and data transfer cable',
    image: 'https://via.placeholder.com/300x300?text=USB-C+Cable',
    category: 'Accessories',
    rating: { rate: 4.8, count: 456 }
  },
  {
    id: 3,
    title: 'Portable Phone Stand',
    price: 15.99,
    description: 'Adjustable and foldable phone stand for all devices',
    image: 'https://via.placeholder.com/300x300?text=Phone+Stand',
    category: 'Accessories',
    rating: { rate: 4.3, count: 89 }
  },
  {
    id: 4,
    title: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector with high clarity',
    image: 'https://via.placeholder.com/300x300?text=Screen+Protector',
    category: 'Accessories',
    rating: { rate: 4.6, count: 234 }
  },
  {
    id: 5,
    title: 'Wireless Charger',
    price: 29.99,
    description: 'Fast wireless charging pad for compatible devices',
    image: 'https://via.placeholder.com/300x300?text=Wireless+Charger',
    category: 'Electronics',
    rating: { rate: 4.7, count: 567 }
  }
];

// Get all products
export async function getAllProducts() {
  return {
    success: true,
    data: products,
    count: products.length
  };
}

// Get single product by ID
export async function getProductById(id: number | string) {
  const product = products.find(p => p.id === parseInt(String(id)));

  if (!product) {
    return {
      success: false,
      message: 'Product not found'
    };
  }

  return {
    success: true,
    data: product
  };
}

// Fetch products (calls API route)
export async function fetchProducts() {
  try {
    // Get the host from headers to construct full URL
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const fullUrl = `${protocol}://${host}/api/products`;

    const response = await fetch(fullUrl, {
      next: { revalidate: false }
    });
    const data = await response.json();
    console.log('data products', data);
    
    return { data: data, success: true };
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
export async function createProduct(productData: { title: string; price: number; description: string; image: string; category?: string }) {
  try {
    // Validate required fields
    if (!productData.title || !productData.price || !productData.description || !productData.image) {
      return {
        success: false,
        message: 'Missing required fields: title, price, description, and image are required'
      };
    }

    // Validate price
    if (isNaN(productData.price) || productData.price < 0) {
      return {
        success: false,
        message: 'Price must be a valid positive number'
      };
    }

    // Create new product
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      title: productData.title,
      price: productData.price,
      description: productData.description,
      image: productData.image,
      category: productData.category || 'Uncategorized',
      rating: { rate: 0, count: 0 }
    };

    products.push(newProduct);

    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create product',
      error: String(error)
    };
  }
}

// Update an existing product
export async function updateProduct(id: number | string, updateData: Partial<{ title: string; price: number; description: string; image: string; category: string }>) {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(String(id)));

    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found'
      };
    }

    // Update only provided fields
    const updatedProduct = {
      ...products[productIndex],
      ...updateData
    };

    products[productIndex] = updatedProduct;

    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update product',
      error: String(error)
    };
  }
}

// Delete a product
export async function deleteProduct(id: number | string) {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(String(id)));

    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found'
      };
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return {
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete product',
      error: String(error)
    };
  }
}
