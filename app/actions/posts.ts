'use server';

import { headers } from "next/headers";

// Type definitions
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Manual posts data - stored in memory (shared with API route)
const posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    body: 'Next.js is a React framework that enables you to build full-stack web applications. It provides server-side rendering, static site generation, and API routes out of the box.',
    userId: 1
  },
  {
    id: 2,
    title: 'Understanding Server Components',
    body: 'Server Components allow you to fetch data directly on the server, reducing client-side JavaScript and improving performance. They run only on the server and never send JavaScript to the client.',
    userId: 1
  },
  {
    id: 3,
    title: 'API Routes in Next.js',
    body: 'API Routes let you create RESTful endpoints as part of your Next.js application. You can create API routes by adding a route.ts file in the app/api directory.',
    userId: 2
  },
  {
    id: 4,
    title: 'Data Fetching Strategies',
    body: 'Next.js provides multiple ways to fetch data: Server Components, Client Components with useEffect, API Routes, and Server Actions. Each has its own use case and benefits.',
    userId: 2
  },
  {
    id: 5,
    title: 'Caching in Next.js',
    body: 'Next.js automatically caches fetch requests and rendered pages. You can control caching behavior using the revalidate option, cache tags, or by using unstable_noStore for dynamic content.',
    userId: 3
  },
  {
    id: 6,
    title: 'Building Forms with Server Actions',
    body: 'Server Actions are async functions that run on the server. They can be used directly in forms without needing API routes, making form handling simpler and more secure.',
    userId: 3
  },
  {
    id: 7,
    title: 'Error Handling Best Practices',
    body: 'Next.js provides error.tsx files for error boundaries, loading.tsx for loading states, and not-found.tsx for 404 pages. These special files help you handle different states in your application.',
    userId: 4
  },
  {
    id: 8,
    title: 'Optimizing Images',
    body: 'The next/image component automatically optimizes images by resizing, converting formats, and lazy loading. It helps improve performance and reduce bandwidth usage.',
    userId: 4
  },
  {
    id: 9,
    title: 'Metadata and SEO',
    body: 'Next.js allows you to export metadata objects or generateMetadata functions to set page titles, descriptions, and Open Graph tags for better SEO and social sharing.',
    userId: 5
  },
  {
    id: 10,
    title: 'Deployment on Vercel',
    body: 'Vercel is the easiest way to deploy Next.js applications. It provides automatic deployments, preview environments, and excellent performance optimizations out of the box.',
    userId: 5
  },
  {
    id: 11,
    title: 'State Management with Redux Toolkit',
    body: 'Redux Toolkit reduces boilerplate by providing createSlice, Immer-powered reducers, and predictable store configuration.',
    userId: 6
  },
  {
    id: 12,
    title: 'Route Groups and Nested Layouts',
    body: 'Route groups help organize app routes without changing URL structure, while nested layouts keep shared UI consistent across sections.',
    userId: 6
  },
  {
    id: 13,
    title: 'Streaming UI with Suspense',
    body: 'Streaming sends HTML in chunks, so users can start reading content while slower sections continue loading in parallel.',
    userId: 7
  },
  {
    id: 14,
    title: 'Migrating to the App Router',
    body: 'A gradual migration works best. Move a route at a time, keep stable modules untouched, and validate behavior after each step.',
    userId: 7
  },
  {
    id: 15,
    title: 'Testing with Seed Data',
    body: 'Seed data helps QA teams validate list, detail, search, and form states without relying on unstable external APIs.',
    userId: 8
  }
];

// Get all posts
export async function getAllPosts() {
  return {
    success: true,
    data: posts,
    count: posts.length
  };
}

// Get single post by ID
export async function getPostById(id: number | string) {
  const post = posts.find(p => p.id === parseInt(String(id)));

  if (!post) {
    return {
      success: false,
      message: 'Post not found'
    };
  }

  return {
    success: true,
    data: post
  };
}

export async function fetchPosts() {
  try {
    // Get the host from headers to construct full URL
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const fullUrl = `${protocol}://${host}/api/posts`;

    const response = await fetch(fullUrl,{
  next: { revalidate: false }
});
    const data = await response.json();
    console.log('data 123',data);
    
    return { data: data, success: true };
  } catch (e) {
    console.log('error in fetchPosts', e);
    return { success: false };
  }
}

export async function fetchPostById(id: string | number): Promise<ApiResponse<Post>> {
  return await getPostById(id);
}

// Create a new post
export async function createPost(postData: { title: string; body: string; userId: number }) {
  try {
    // Generate new ID (find max current ID and add 1)
    const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
    const newId = maxId + 1;

    const newPost: Post = {
      id: newId,
      title: postData.title,
      body: postData.body,
      userId: postData.userId
    };

    // Add to posts array
    posts.push(newPost);

    return {
      success: true,
      data: newPost,
      message: 'Post created successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create post'
    };
  }
}
