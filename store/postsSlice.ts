import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type PostsState = {
  items: Post[];
};

const initialState: PostsState = {
  items: [
    {
      id: 1,
      title: 'Getting Started with Next.js',
      body: 'Next.js is a React framework for full-stack apps with server rendering and API routes.',
      userId: 1,
    },
    {
      id: 2,
      title: 'Understanding Server Components',
      body: 'Server Components fetch data on the server and reduce client-side JavaScript.',
      userId: 1,
    },
    {
      id: 3,
      title: 'API Routes in Next.js',
      body: 'API routes let you build REST endpoints inside your app.',
      userId: 2,
    },
    {
      id: 4,
      title: 'Data Fetching Strategies',
      body: 'Use server components, client effects, API routes, or server actions based on the use case.',
      userId: 2,
    },
    {
      id: 5,
      title: 'Caching in Next.js',
      body: 'Control caching with revalidate, cache tags, and no-store for dynamic data.',
      userId: 3,
    },
    {
      id: 6,
      title: 'Building Forms with Server Actions',
      body: 'Server Actions simplify form handling with secure server-side execution.',
      userId: 3,
    },
    {
      id: 7,
      title: 'Error Handling Best Practices',
      body: 'Use error.tsx, loading.tsx, and not-found.tsx to handle app states cleanly.',
      userId: 4,
    },
    {
      id: 8,
      title: 'Optimizing Images',
      body: 'next/image improves performance with optimization and lazy loading.',
      userId: 4,
    },
    {
      id: 9,
      title: 'Metadata and SEO',
      body: 'Use metadata exports for title, description, and social preview tags.',
      userId: 5,
    },
    {
      id: 10,
      title: 'Deployment on Vercel',
      body: 'Vercel offers fast deployments, preview URLs, and production optimizations.',
      userId: 5,
    },
    {
      id: 11,
      title: 'State Management with Redux Toolkit',
      body: 'Redux Toolkit reduces boilerplate and provides predictable state updates.',
      userId: 6,
    },
    {
      id: 12,
      title: 'Route Groups and Layouts',
      body: 'Route groups help organize app structure without changing URL paths.',
      userId: 6,
    },
    {
      id: 13,
      title: 'Streaming and Suspense',
      body: 'Streaming lets users see content sooner while slower parts continue loading.',
      userId: 7,
    },
    {
      id: 14,
      title: 'App Router Migration Tips',
      body: 'Migrate gradually by splitting routes and introducing layouts in steps.',
      userId: 7,
    },
    {
      id: 15,
      title: 'Testing UI with Mock Data',
      body: 'Seeded sample data helps verify UX, forms, and empty/loading states quickly.',
      userId: 8,
    },
  ],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<{ title: string; body: string; userId: number }>) {
      const title = action.payload.title.trim();
      const body = action.payload.body.trim();
      if (!title || !body) return;
      const nextId = state.items.length > 0 ? Math.max(...state.items.map((item) => item.id)) + 1 : 1;
      state.items.push({
        id: nextId,
        title,
        body,
        userId: action.payload.userId,
      });
    },
  },
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
