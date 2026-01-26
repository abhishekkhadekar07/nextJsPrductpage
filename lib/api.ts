// API client functions for calling Next.js API routes

import { getAllPosts, getPostById } from '../app/actions/posts';

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

// Fetch all posts
export async function fetchAllPosts(): Promise<ApiResponse<Post[]>> {
  return await getAllPosts();
}

// Fetch a single post by ID
export async function fetchPostById(id: string | number): Promise<ApiResponse<Post>> {
  return await getPostById(id);
}