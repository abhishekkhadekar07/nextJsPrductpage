# Server Actions Quick Start Guide

## 🚀 Quick Example (5 minutes)

### Step 1: Create a Server Action

```typescript
// app/actions/my-action.ts
'use server'

export async function myAction(formData: FormData) {
  const name = formData.get('name') as string;
  
  // Validation
  if (!name || name.length < 3) {
    return { error: 'Name must be at least 3 characters' };
  }
  
  // Do something (save to DB, call API, etc.)
  // ...
  
  return { success: true, message: 'Done!' };
}
```

### Step 2: Use in Your Form

```typescript
// app/my-page/page.tsx
'use client'
import { useActionState } from 'react';
import { myAction } from '../actions/my-action';

export default function MyPage() {
  const [state, formAction, isPending] = useActionState(myAction, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>{state.message}</p>}
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

**That's it!** Your form now uses server actions.

---

## 📋 Common Patterns

### Pattern 1: Simple Form Submission

```typescript
'use server'
export async function submitForm(formData: FormData) {
  const email = formData.get('email') as string;
  // ... process
  return { success: true };
}
```

### Pattern 2: With Validation

```typescript
'use server'
export async function submitForm(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email || !email.includes('@')) {
    return { error: 'Invalid email' };
  }
  
  return { success: true };
}
```

### Pattern 3: With Previous State (useActionState)

```typescript
'use server'
export async function submitForm(
  prevState: any,
  formData: FormData
) {
  // prevState contains previous result
  // Useful for showing errors that persist
  return { success: true };
}
```

### Pattern 4: Redirect After Success

```typescript
'use server'
import { redirect } from 'next/navigation';

export async function submitForm(formData: FormData) {
  // ... process
  redirect('/success'); // Redirects after completion
}
```

### Pattern 5: Revalidate Data

```typescript
'use server'
import { revalidatePath } from 'next/cache';

export async function submitForm(formData: FormData) {
  // ... process
  revalidatePath('/posts'); // Refreshes /posts page
  return { success: true };
}
```

---

## 🎯 Key Points to Remember

1. **`'use server'`** - Must be at the top of server action files
2. **FormData** - Use `formData.get('fieldName')` to get values
3. **Return objects** - Return `{ success: true }` or `{ error: 'message' }`
4. **useActionState** - Hook that manages state, action, and pending status
5. **Progressive enhancement** - Forms work without JavaScript!

---

## 🔍 What You Have in This Project

### ✅ Implemented Examples:

1. **Post Creation** (`app/actions/posts.ts`)
   - Full validation
   - Error handling
   - External API integration
   - Used in `app/posts/new/page.tsx`

2. **Product Operations** (`app/actions/products.ts`)
   - Product update example
   - Validation patterns
   - Ready to use

### 📚 Documentation:

- `SERVER_ACTIONS_GUIDE.md` - Complete tutorial
- `SERVER_ACTIONS_COMPARISON.md` - Before/After comparison
- `SERVER_ACTIONS_QUICK_START.md` - This file!

---

## 🎓 Next Steps

1. ✅ Read the examples in `app/actions/`
2. ✅ Try the form at `/posts/new`
3. ✅ Read `SERVER_ACTIONS_GUIDE.md` for details
4. ✅ Convert other forms to use server actions
5. ✅ Experiment with revalidation and redirects

---

## 💡 Tips

- **Start simple**: Convert one form at a time
- **Use TypeScript**: Get full type safety
- **Test without JS**: Disable JavaScript to test progressive enhancement
- **Handle errors**: Always return error objects
- **Show feedback**: Display success/error messages to users

---

Happy coding! 🚀
