'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import styles from './page.module.css';

export default function PostsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const posts = useSelector((state: RootState) => state.posts.items);

  const filtered = q
    ? posts.filter((post) => {
        const searchText = `${post.title} ${post.body}`.toLowerCase();
        return searchText.includes(q.toLowerCase());
      })
    : posts;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Posts</h1>
          <Link href="/posts/add" className={styles.addButton}>
            Add Post
          </Link>
        </div>
        <form className={styles.searchForm} method="get" action="/posts">
          <input
            name="q"
            placeholder="Search posts..."
            defaultValue={q}
            className={styles.searchInput}
            aria-label="Search posts"
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </header>

      <main>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No posts found.</p>
        ) : (
          <ul className={styles.grid}>
            {filtered.map((post) => (
              <li key={post.id} className={styles.card}>
                <Link href={`/posts/${post.id}`} className={styles.cardLink}>
                  <div className={styles.cardBody}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postBody}>{post.body}</p>
                    <p className={styles.userId}>User ID: {post.userId}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
