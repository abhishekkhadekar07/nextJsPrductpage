'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddProductForm.module.css';

interface FormErrors {
  title?: string;
  price?: string;
  description?: string;
  image?: string;
  category?: string;
  general?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: string[];
  data?: unknown;
}

type AddProductFormProps = {
  redirectTo?: string;
};

export default function AddProductForm({ redirectTo = '/products' }: AddProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (Number.isNaN(priceNum)) {
        newErrors.price = 'Price must be a valid number';
      } else if (priceNum < 0) {
        newErrors.price = 'Price cannot be negative';
      } else if (priceNum > 10000) {
        newErrors.price = 'Price cannot exceed $10,000';
      }
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        const parsed = new URL(formData.image);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.image = 'Image URL must start with http:// or https://';
        }
      } catch {
        newErrors.image = 'Image URL must be a valid URL';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitMessage(null);
    setErrors({});

    if (!validateForm()) {
      setSubmitMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        image: formData.image.trim(),
        category: formData.category.trim(),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        router.push(redirectTo);
        return;
      } else if (result.errors && result.errors.length > 0) {
        setErrors({ general: result.errors.join(', ') });
        setSubmitMessage({ type: 'error', text: result.message || 'Validation failed' });
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Failed to add product' });
      }
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please try again later.',
      });
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (submitMessage?.type === 'success') {
      setSubmitMessage(null);
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Add Product</h2>
      <p className={styles.subtitle}>
        Create a new product entry to add to the catalog. All fields are validated on client and server.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {submitMessage && (
          <div className={`${styles.message} ${styles[submitMessage.type]}`}>
            {submitMessage.type === 'success' ? '[OK]' : '[ERROR]'} {submitMessage.text}
          </div>
        )}

        {errors.general && (
          <div className={`${styles.message} ${styles.error}`}>[ERROR] {errors.general}</div>
        )}

        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Product Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            placeholder="Enter product title"
            disabled={isSubmitting}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            Price ($) <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
            max="10000"
            disabled={isSubmitting}
          />
          {errors.price && <span className={styles.errorText}>{errors.price}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category <span className={styles.required}>*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${styles.input} ${styles.select} ${errors.category ? styles.inputError : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="jewelry">Jewelry</option>
            <option value="books">Books</option>
            <option value="toys">Toys</option>
            <option value="sports">Sports</option>
          </select>
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="image" className={styles.label}>
            Image URL <span className={styles.required}>*</span>
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
            placeholder="https://placehold.co/600x400"
            disabled={isSubmitting}
          />
          <span className={styles.helperText}>
            Tip: Use a `placehold.co` or `fakestoreapi.com` image URL.
          </span>
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Description <span className={styles.required}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            placeholder="Enter product description"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className={styles.charCount}>{formData.description.length} / 500 characters</div>
          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
