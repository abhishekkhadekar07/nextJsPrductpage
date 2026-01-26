'use server';

// Manual posts data - stored in memory (shared with API route)
let posts = [
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
    id: 12,
    title: 'Testing in Next.js',
    body: 'Vercel is the easiest way to deploy Next.js applications. It provides automatic deployments, preview environments, and excellent performance optimizations out of the box.',
    userId: 6
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

// Create new post
// export async function createPost(formData: FormData) {
//   const title = formData.get('title') as string;
//   const body = formData.get('body') as string;
//   const userId = formData.get('userId') as string;

//   // Validate required fields
//   if (!title || !body) {
//     return {
//       success: false,
//       message: 'Title and body are required',
//       errors: [
//         !title && 'Title is required',
//         !body && 'Body is required'
//       ].filter(Boolean) as string[]
//     };
//   }

//   // Validate field lengths
//   const errors: string[] = [];
//   if (title.trim().length < 3) {
//     errors.push('Title must be at least 3 characters');
//   }
//   if (title.trim().length > 200) {
//     errors.push('Title must be less than 200 characters');
//   }
//   if (body.trim().length < 10) {
//     errors.push('Body must be at least 10 characters');
//   }
//   if (body.trim().length > 5000) {
//     errors.push('Body must be less than 5000 characters');
//   }

//   if (errors.length > 0) {
//     return {
//       success: false,
//       message: 'Validation failed',
//       errors
//     };
//   }

//   // Create new post
//   const newPost = {
//     id: nextId++,
//     title: title.trim(),
//     body: body.trim(),
//     userId: userId ? parseInt(userId) : 1,
//   };

//   // Add to posts array
//   posts.push(newPost);

//   return {
//     success: true,
//     message: 'Post created successfully!',
//     data: newPost
//   };
// }

// Export posts array for API route to use
export async function getPostsData() {
  return posts;
}

// export function setPostsData(newPosts: typeof posts) {
//   posts = newPosts;
// }

// export function getNextId() {
//   return nextId;
// }

// export function setNextId(id: number) {
//   nextId = id;
// }
