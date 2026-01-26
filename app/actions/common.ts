'use server'

import { headers } from 'next/headers';

export async function submitFormAction(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  console.log(name, email, password);
  return { success: true, message: 'Form submitted successfully' };
}

export async function fetchPosts() {
  try {
    // Get the host from headers to construct full URL
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const fullUrl = `${protocol}://${host}/api/posts`;

    const response = await fetch(fullUrl);
    const data = await response.json();
    console.log('data 123',data);
    
    return { data: data, success: true };
  } catch (e) {
    console.log('error in fetchPosts', e);
    return { success: false };
  }
}