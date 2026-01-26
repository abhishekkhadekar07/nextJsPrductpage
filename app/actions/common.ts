'use server'
import { getPostById } from './posts';

export async function submitFormAction(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  console.log(name, email, password);
  return { success: true, message: 'Form submitted successfully' };
}


