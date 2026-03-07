'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type LoginFormProps = {
  redirectTo: string;
  initialUsername?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
};

export default function LoginForm({ redirectTo, initialUsername = '' }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: initialUsername,
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Login error', err);
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }

  const signupHref = `/signup?from=${encodeURIComponent(redirectTo)}`;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className={styles.input}
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter your username"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>

      <div className={styles.helperText}>After signing in, you will be redirected to your products view.</div>
      <div className={styles.helperText}>
        No account yet?{' '}
        <Link className={styles.switchLink} href={signupHref}>
          Sign up
        </Link>
      </div>
    </form>
  );
}
