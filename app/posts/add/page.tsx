'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../../../store/postsSlice';
import styles from '../page.module.css';

export default function AddPostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('1');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const parsedUserId = Number(userId);
    if (!title.trim() || !body.trim() || Number.isNaN(parsedUserId) || parsedUserId <= 0) {
      setError('All fields are required and User ID must be a valid number.');
      return;
    }

    dispatch(
      addPost({
        title,
        body,
        userId: parsedUserId,
      })
    );
    router.push('/posts');
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/posts" className={styles.back}>
          {'<-'} Back to posts
        </Link>
        <h1 className={styles.title}>Add New Post</h1>
      </header>

      <main>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={body}
              onChange={(e) => setBody(e.target.value)}
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
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.input}
              placeholder="Enter user ID"
            />
          </div>

          {error ? <p className={styles.userId}>{error}</p> : null}

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
