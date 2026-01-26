# API Usage Examples - Posts API

This guide shows how to use the `/api/posts` endpoint from different pages.

## 📍 API Endpoint

**URL:** `/api/posts`

**Methods:**
- `GET` - Fetch all posts or a single post
- `POST` - Create a new post

---

## 🔵 GET Method Examples

### Example 1: Fetch All Posts (Client Component)

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Example 2: Fetch Single Post (Client Component)

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function PostDetail({ postId }: { postId: string }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts?id=${postId}`);
        const data = await response.json();
        
        if (data.success) {
          setPost(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
```

### Example 3: Fetch All Posts (Server Component)

```typescript
// app/posts/page.tsx
export default async function PostsPage() {
  const response = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store' // or use revalidate
  });
  
  const data = await response.json();
  const posts = data.success ? data.data : [];

  return (
    <div>
      {posts.map((post: any) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Fetch Single Post (Server Component)

```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost:3000/api/posts?id=${params.id}`);
  const data = await response.json();
  
  if (!data.success) {
    return <div>Post not found</div>;
  }

  const post = data.data;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
```

---

## 🟢 POST Method Examples

### Example 1: Create Post (Client Component with Form)

```typescript
'use client';

import { useState, FormEvent } from 'react';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          userId: 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Post created successfully!');
        setTitle('');
        setBody('');
      } else {
        setMessage(data.message || 'Failed to create post');
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### Example 2: Create Post (Server Action)

```typescript
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const userId = formData.get('userId') as string;

  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
      userId: parseInt(userId) || 1
    }),
  });

  const data = await response.json();
  return data;
}
```

### Example 3: Create Post with Error Handling

```typescript
'use client';

import { useState } from 'react';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: '1'
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else {
          setErrors([data.message || 'Failed to create post']);
        }
        return;
      }

      // Success
      alert('Post created successfully!');
      setFormData({ title: '', body: '', userId: '1' });
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={formData.body}
        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        placeholder="Body"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## 📝 Response Format

### GET Response (All Posts)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Post title",
      "body": "Post body",
      "userId": 1
    }
  ],
  "count": 100
}
```

### GET Response (Single Post)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Post title",
    "body": "Post body",
    "userId": 1
  }
}
```

### POST Success Response
```json
{
  "success": true,
  "message": "Post created successfully!",
  "data": {
    "id": 101,
    "title": "New post",
    "body": "Post content",
    "userId": 1
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 3 characters",
    "Body must be at least 10 characters"
  ]
}
```

---

## 🎯 Quick Reference

### GET Request
```typescript
// All posts
fetch('/api/posts')

// Single post
fetch('/api/posts?id=1')
```

### POST Request
```typescript
fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    body: 'Post content here',
    userId: 1
  })
})
```

---

## ✅ Validation Rules

- **Title**: Required, 3-200 characters
- **Body**: Required, 10-5000 characters
- **UserId**: Optional, must be positive integer (defaults to 1)

---

## 🔗 See Also

- `app/api/posts/route.ts` - API implementation
- `app/posts/new/page.tsx` - Example usage in create post page
