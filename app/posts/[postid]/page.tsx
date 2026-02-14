'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import styles from './page.module.css';

export default function PostPage() {
  const params = useParams<{ postid: string }>();
  const postId = Number(params?.postid);
  const posts = useSelector((state: RootState) => state.posts.items);

  const post = useMemo(
    () => posts.find((item) => item.id === postId),
    [posts, postId]
  );

  if (!post) {
    return (
      <div className={styles.container}>
        <Link href="/posts" className={styles.back}>{'<-'} Back to posts</Link>
        <div className={styles.content}>
          <h1>Post not found</h1>
          <p>The post you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/posts" className={styles.back}>{'<-'} Back to posts</Link>
      <div className={styles.content}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>Post ID: {post.id}</span>
          <span>|</span>
          <span>User ID: {post.userId}</span>
        </div>
        <div className={styles.body}>{post.body}</div>
      </div>
    </div>
  );
}
