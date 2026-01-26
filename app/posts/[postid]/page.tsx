import Link from 'next/link';
import styles from './page.module.css';
import { fetchPostById } from '@/app/actions/posts';

// import { fetchPostById } from '../../../lib/api';

export default async function PostPage(props: { params: Promise<{ postid: string }> }) {
    const params = await props.params;
    const postId = params.postid;

    // Use API route to get post
    const result = await fetchPostById(postId);

    if (!result.success || !result.data) {
        return (
            <div className={styles.container}>
                <Link href="/posts" className={styles.back}>← Back to posts</Link>
                <div className={styles.content}>
                    <h1>Post not found</h1>
                    <p>The post you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const post = result.data;

    return (
        <div className={styles.container}>
            <Link href="/posts" className={styles.back}>← Back to posts</Link>
            <div className={styles.content}>
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.meta}>
                    <span>Post ID: {post.id}</span>
                    <span>•</span>
                    <span>User ID: {post.userId}</span>
                </div>
                <div className={styles.body}>
                    {post.body}
                </div>
            </div>
        </div>
    );
}
