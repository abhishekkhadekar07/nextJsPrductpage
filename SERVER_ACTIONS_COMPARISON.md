# Server Actions: Before vs After Comparison

This document shows the difference between using API Routes vs Server Actions.

## 📊 Code Comparison

### BEFORE: Using API Routes

#### 1. API Route (`app/api/posts/route.ts`)

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    const errors: string[] = [];
    if (!body.title || body.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // API call
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
  }
}
```

#### 2. Client Component (`app/posts/new/page.tsx`)

```typescript
'use client';
import { useState } from 'react';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      const result = await response.json();

      if (result.success) {
        // Handle success
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

**Lines of code: ~80 lines**

---

### AFTER: Using Server Actions

#### 1. Server Action (`app/actions/posts.ts`)

```typescript
'use server';

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')?.toString().trim() || '';
  const body = formData.get('body')?.toString().trim() || '';

  // Validation
  const errors: string[] = [];
  if (!title || title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // API call
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });

  const data = await response.json();
  return { success: true, data };
}
```

#### 2. Client Component (`app/posts/new/page.tsx`)

```typescript
'use client';
import { useActionState } from 'react';
import { createPost } from '../../actions/posts';

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" />
      <textarea name="body" />
      {state?.errors && <div>{state.errors.join(', ')}</div>}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

**Lines of code: ~40 lines** (50% reduction!)

---

## 🎯 Key Differences

| Feature                     | API Routes               | Server Actions                        |
| --------------------------- | ------------------------ | ------------------------------------- |
| **Code Location**           | Separate API route file  | Can be in same file or actions folder |
| **Form Handling**           | Manual `fetch()` calls   | Direct `action` prop                  |
| **State Management**        | Manual `useState` hooks  | `useActionState` hook                 |
| **Progressive Enhancement** | ❌ Requires JavaScript   | ✅ Works without JS                   |
| **Type Safety**             | Manual typing            | Full TypeScript support               |
| **Error Handling**          | Manual try/catch         | Built-in error handling               |
| **Loading States**          | Manual `isLoading` state | `isPending` from hook                 |
| **Code Complexity**         | Higher                   | Lower                                 |

---

## ✅ Benefits of Server Actions

### 1. **Less Code**

- No need for separate API route files
- No manual fetch calls
- No manual state management

### 2. **Progressive Enhancement**

```typescript
// This form works even if JavaScript is disabled!
<form action={createPost}>
  <input name="title" />
  <button>Submit</button>
</form>
```

### 3. **Better Type Safety**

```typescript
// TypeScript knows the return type
const [state, formAction] = useActionState(createPost, null);
// state is automatically typed as PostActionResult | null
```

### 4. **Simpler Error Handling**

```typescript
// Errors are automatically handled
{state?.errors && (
  <div>{state.errors.map(e => <p>{e}</p>)}</div>
)}
```

### 5. **Automatic Loading States**

```typescript
// isPending is automatically managed
const [state, formAction, isPending] = useActionState(createPost, null);
<button disabled={isPending}>Submit</button>
```

---

## 🔄 Migration Steps

To convert from API Routes to Server Actions:

1. **Create server action file**

   ```typescript
   // app/actions/posts.ts
   'use server';
   export async function createPost(formData: FormData) {
     // Move validation and logic from API route
   }
   ```

2. **Update component**

   ```typescript
   // Replace useState with useActionState
   const [state, formAction, isPending] = useActionState(createPost, null);

   // Replace form onSubmit with action prop
   <form action={formAction}>
   ```

3. **Update form inputs**

   ```typescript
   // Remove value/onChange, add name prop
   <input name="title" />  // Instead of value={title} onChange={...}
   ```

4. **Update error display**
   ```typescript
   // Use state.errors instead of local errors state
   {state?.errors && <div>{state.errors}</div>}
   ```

---

## 📚 When to Use Each

### Use Server Actions When:

- ✅ Form submissions
- ✅ Mutations (create, update, delete)
- ✅ You want progressive enhancement
- ✅ You want simpler code

### Use API Routes When:

- ✅ External API integrations
- ✅ Webhooks
- ✅ Complex middleware needs
- ✅ Third-party integrations that require specific endpoints

---

## 🎓 Summary

**Server Actions** simplify form handling by:

- Reducing code by ~50%
- Eliminating the need for API routes
- Providing built-in state management
- Supporting progressive enhancement
- Improving type safety

The conversion is straightforward and results in cleaner, more maintainable code!
