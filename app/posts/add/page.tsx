import Link from 'next/link';
import { createPost } from '../../actions/posts';
import { redirect } from 'next/navigation';
import styles from '../page.module.css';

export default function AddPostPage() {
  async function handleSubmit(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const userId = parseInt(formData.get('userId') as string);

    if (!title || !body || !userId) {
      throw new Error('All fields are required');
    }

    const result = await createPost({ title, body, userId });

    if (!result.success) {
      throw new Error(result.message || 'Failed to create post');
    }

    // Redirect to posts page after successful creation
    redirect('/posts');
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/posts" className={styles.back}>← Back to posts</Link>
        <h1>Add New Post</h1>
      </header>

      <main>
        <form className={styles.form} action={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={styles.input}
              placeholder="Enter post title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="body" className={styles.label}>
              Content *
            </label>
            <textarea
              id="body"
              name="body"
              required
              className={styles.textarea}
              placeholder="Enter post content"
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.label}>
              User ID *
            </label>
            <input
              type="number"
              id="userId"
              name="userId"
              required
              min="1"
              className={styles.input}
              placeholder="Enter user ID"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Create Post
            </button>
            <Link href="/posts" className={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}