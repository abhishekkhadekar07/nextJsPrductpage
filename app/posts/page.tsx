import Link from 'next/link';
import styles from './page.module.css';
import { fetchPosts } from '../actions/common';
import { Post } from '../../lib/api';

export default async function PostsPage(props: { searchParams?: Promise<{ q?: string | string[] }> }) {
    const searchParams = props.searchParams ? await props.searchParams : {};
    const q = typeof searchParams.q === 'string' ? searchParams.q : (searchParams.q?.[0] ?? '');

    // Use API route to get posts
    const result = await fetchPosts();
    const posts: Post[] = result.success && result.data && result.data.data ? result.data.data : [];

    const filtered = q
        ? posts.filter(post => {
            const searchText = `${post.title || ''} ${post.body || ''}`.toLowerCase();
            return searchText.includes(q.toLowerCase());
        })
        : posts;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <form className={styles.searchForm} method="get" action="/posts">
                    <input
                        name="q"
                        placeholder="Search posts..."
                        defaultValue={q}
                        className={styles.searchInput}
                        aria-label="Search posts"
                    />
                    <button type="submit" className={styles.searchButton}>Search</button>
                </form>
            </header>

            <main>
                {filtered.length === 0 ? (
                    <p className={styles.empty}>No posts found.</p>
                ) : (
                    <ul className={styles.grid}>
                        {filtered.map((post: Post) => (
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
