import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllProducts, createProduct } from '../../actions/products';
import { AUTH_COOKIE_NAME, parseAuthCookieValue } from '../../../lib/auth';

// GET - Fetch all products
export async function GET(request: Request) {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
    const authUser = parseAuthCookieValue(authCookie?.value);
    if (!authUser?.username) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }
    console.log('request for products', request);
    const result = await getAllProducts();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch products',
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
    const authUser = parseAuthCookieValue(authCookie?.value);
    if (!authUser?.username) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }
    let body: {
      title?: string;
      price?: string | number;
      description?: string;
      image?: string;
      category?: string;
    } = {};

    // Check content type to handle both JSON and form data
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else if (
      contentType?.includes('application/x-www-form-urlencoded') ||
      contentType?.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      body = {
        title: formData.get('title') as string,
        price: formData.get('price') as string,
        description: formData.get('description') as string,
        image: formData.get('image') as string,
        category: formData.get('category') as string,
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported content type',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.price || !body.description || !body.image) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: title, price, description, and image are required',
        },
        { status: 400 }
      );
    }

    // Convert price to number if it's a string
    const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;

    // Validate price
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Price must be a valid positive number',
        },
        { status: 400 }
      );
    }

    // Create the product
    const result = await createProduct({
      title: body.title,
      price: price,
      description: body.description,
      image: body.image,
      category: body.category as string,
      createdBy: authUser.username,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create product',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
