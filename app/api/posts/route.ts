import { NextResponse } from 'next/server';
import { getAllPosts, getPostById } from '../../actions/posts';


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

