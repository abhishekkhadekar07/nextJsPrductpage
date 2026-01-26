import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '../../actions/posts';


// GET - Fetch all posts or a single post
export async function GET(request: Request) {
  try {
    console.log('request for posts',request);
    const result = await getAllPosts();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch posts',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: Request) {
  try {
    let body: { title?: string; body?: string; userId?: string | number } = {};

    // Check content type to handle both JSON and form data
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded') ||
               contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {
        title: formData.get('title') as string,
        body: formData.get('body') as string,
        userId: formData.get('userId') as string
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported content type'
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.body || !body.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: title, body, and userId are required'
        },
        { status: 400 }
      );
    }

    // Convert userId to number if it's a string
    const userId = typeof body.userId === 'string' ? parseInt(body.userId) : body.userId;

    // Create the post
    const result = await createPost({
      title: body.title,
      body: body.body,
      userId: userId
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create post',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

