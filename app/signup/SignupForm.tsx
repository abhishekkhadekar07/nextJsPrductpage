'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from '../login/page.module.css';

type SignupFormProps = {
  redirectTo: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  user?: { username: string };
};

export default function SignupForm({ redirectTo }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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

    const username = formData.username.trim();
    if (!username || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: formData.password,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Signup failed. Please try another username.');
        setIsSubmitting(false);
        return;
      }

      const nextLoginUrl = `/login?from=${encodeURIComponent(redirectTo)}&username=${encodeURIComponent(
        result.user?.username || username
      )}`;
      router.replace(nextLoginUrl);
      router.refresh();
    } catch (err) {
      console.error('Signup error', err);
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }

  const loginHref = `/login?from=${encodeURIComponent(redirectTo)}`;

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
          placeholder="Choose a username"
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
          autoComplete="new-password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Choose a password"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Re-enter your password"
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </button>

      <div className={styles.helperText}>
        Already registered?{' '}
        <Link className={styles.switchLink} href={loginHref}>
          Sign in
        </Link>
      </div>
    </form>
  );
}