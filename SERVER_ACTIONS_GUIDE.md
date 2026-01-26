# Server Actions Guide - Complete Tutorial

## 🎯 What are Server Actions?

**Server Actions** are a Next.js feature that lets you run server-side code directly from your React components. Instead of creating API routes and making fetch requests, you can call server functions directly from your forms and components.

### Key Benefits:
- ✅ **Simpler code**: No need for API routes or fetch calls
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Progressive enhancement**: Works without JavaScript
- ✅ **Better performance**: Less client-side JavaScript
- ✅ **Automatic revalidation**: Can refresh data after mutations

## 📊 Server Actions vs API Routes

### Traditional Approach (API Routes):
```typescript
// 1. Create API route: app/api/posts/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  // ... validation and logic
  return NextResponse.json({ success: true });
}

// 2. Client component makes fetch request
const response = await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Server Actions Approach:
```typescript
// 1. Create server action: app/actions/posts.ts
'use server'
export async function createPost(data: FormData) {
  // ... validation and logic
  return { success: true };
}

// 2. Use directly in form
<form action={createPost}>
  <input name="title" />
  <button>Submit</button>
</form>
```

## 🚀 How Server Actions Work

### Step 1: Create a Server Action File

Create a file with `'use server'` directive at the top:

```typescript
// app/actions/posts.ts
'use server'

export async function createPost(formData: FormData) {
  // This code runs on the server!
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  
  // Validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  // Database/external API call
  const response = await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title, body })
  });
  
  return { success: true, data: await response.json() };
}
```

### Step 2: Use in Your Component

#### Option A: Direct Form Action (Progressive Enhancement)
```typescript
// app/posts/new/page.tsx
import { createPost } from '../actions/posts';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="body" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

#### Option B: With useActionState (React Hook)
```typescript
'use client'
import { useActionState } from 'react';
import { createPost } from '../actions/posts';

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  
  return (
    <form action={formAction}>
      <input name="title" required />
      {state?.error && <p>{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

#### Option C: With useFormState (Alternative Hook)
```typescript
'use client'
import { useFormState } from 'react-dom';
import { createPost } from '../actions/posts';

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, null);
  
  return (
    <form action={formAction}>
      {/* form fields */}
    </form>
  );
}
```

## 🔑 Key Concepts

### 1. The `'use server'` Directive

This tells Next.js that the function runs on the server:
```typescript
'use server'  // Must be at the top of the file or function

export async function myAction() {
  // Server-side code
}
```

### 2. FormData vs Object Parameters

Server actions can accept:
- **FormData**: From HTML forms (native)
- **Objects**: From JavaScript (needs serialization)

```typescript
// FormData (recommended for forms)
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
}

// Object (for programmatic calls)
export async function createPost(data: { title: string; body: string }) {
  // ...
}
```

### 3. Return Values

Server actions can return:
- **Success objects**: `{ success: true, data: ... }`
- **Error objects**: `{ error: 'Message' }`
- **Redirects**: `redirect('/posts')`
- **Revalidation**: `revalidatePath('/posts')`

### 4. Error Handling

```typescript
'use server'
export async function createPost(formData: FormData) {
  try {
    // ... logic
    return { success: true };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Something went wrong' 
    };
  }
}
```

## 📝 Complete Example: Post Creation

### Server Action File
```typescript
// app/actions/posts.ts
'use server'

type ActionResult = {
  success: boolean;
  message?: string;
  errors?: string[];
  data?: any;
};

export async function createPost(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  // Extract form data
  const title = formData.get('title')?.toString().trim() || '';
  const body = formData.get('body')?.toString().trim() || '';
  const userId = parseInt(formData.get('userId')?.toString() || '1');

  // Validation
  const errors: string[] = [];
  
  if (!title || title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!body || body.length < 10) {
    errors.push('Body must be at least 10 characters');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    // Call external API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Post created successfully!',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create post'
    };
  }
}
```

### Component Using Server Action
```typescript
'use client'
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '../actions/posts';

export default function NewPostPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createPost, null);

  // Redirect on success
  if (state?.success) {
    setTimeout(() => router.push('/posts'), 1500);
  }

  return (
    <form action={formAction}>
      {state?.message && (
        <div className={state.success ? 'success' : 'error'}>
          {state.message}
        </div>
      )}
      
      {state?.errors && (
        <ul>
          {state.errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}

      <input 
        name="title" 
        placeholder="Title"
        disabled={isPending}
      />
      
      <textarea 
        name="body" 
        placeholder="Body"
        disabled={isPending}
      />
      
      <input 
        name="userId" 
        type="number" 
        defaultValue="1"
        disabled={isPending}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

## 🎨 Advanced Patterns

### 1. Revalidating Data After Mutation

```typescript
'use server'
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  // ... create post
  
  // Refresh the posts page
  revalidatePath('/posts');
  
  return { success: true };
}
```

### 2. Redirecting After Success

```typescript
'use server'
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  // ... create post
  
  redirect('/posts'); // Redirect to posts page
}
```

### 3. Using with useTransition

```typescript
'use client'
import { useTransition } from 'react';
import { createPost } from '../actions/posts';

export default function Form() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createPost(formData);
      // Handle result
    });
  };

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

### 4. Optimistic Updates

```typescript
'use client'
import { useOptimistic } from 'react';
import { createPost } from '../actions/posts';

export default function PostsList({ posts }: { posts: Post[] }) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost: Post) => [...state, newPost]
  );

  async function handleSubmit(formData: FormData) {
    const newPost = {
      id: Date.now(),
      title: formData.get('title') as string,
      body: formData.get('body') as string,
    };

    // Optimistically add to UI
    addOptimisticPost(newPost);

    // Actually create on server
    await createPost(formData);
  }

  return (
    <>
      <form action={handleSubmit}>
        {/* form */}
      </form>
      {optimisticPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
```

## 🔒 Security Best Practices

1. **Always validate on server**: Client validation can be bypassed
2. **Sanitize inputs**: Remove dangerous characters
3. **Use TypeScript**: Catch errors at compile time
4. **Handle errors gracefully**: Don't expose sensitive info
5. **Rate limiting**: Consider adding rate limits for production

## 📚 When to Use Server Actions vs API Routes

### Use Server Actions When:
- ✅ Form submissions
- ✅ Mutations (create, update, delete)
- ✅ Simple server-side operations
- ✅ You want progressive enhancement

### Use API Routes When:
- ✅ External API integrations
- ✅ Webhooks
- ✅ Complex middleware needs
- ✅ Third-party integrations

## 🎓 Learning Path

1. **Start Simple**: Convert one form to use server actions
2. **Add Validation**: Implement server-side validation
3. **Handle Errors**: Add proper error handling
4. **Add Revalidation**: Refresh data after mutations
5. **Optimistic Updates**: Improve UX with optimistic UI

## 📖 Additional Resources

- [Next.js Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useActionState Hook](https://react.dev/reference/react/useActionState)
- [React useFormState Hook](https://react.dev/reference/react-dom/hooks/useFormState)
- [Progressive Enhancement](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#progressive-enhancement)

## 🎯 Quick Reference

```typescript
// Server Action
'use server'
export async function myAction(formData: FormData) {
  const value = formData.get('field');
  // ... logic
  return { success: true };
}

// Component
'use client'
import { useActionState } from 'react';
import { myAction } from './actions';

export default function Form() {
  const [state, formAction, isPending] = useActionState(myAction, null);
  
  return (
    <form action={formAction}>
      <input name="field" />
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

---

**Next Steps**: Check out the implemented examples in:
- `app/actions/posts.ts` - Post creation server action
- `app/posts/new/page.tsx` - Form using server action
- `app/actions/products.ts` - Product operations example
