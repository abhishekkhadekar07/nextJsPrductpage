'use client'
import styles from './page.module.css';
import { submitFormAction } from './actions/common';
import { useActionState } from 'react';

export default function Home() {
  const [state, formAction, isPending] = useActionState<any>(submitFormAction, null);
  console.log('state', state, 'formAction', formAction, 'isPending', isPending);

  return (
    <div className={styles.container}>
      <div>
        <form action={submitFormAction} method='POST'>
          <label htmlFor='name'>Name</label>
          <input type="text" name="name" placeholder='Enter your name' />
          <br />
          <label htmlFor='email'>Email</label>
          <input type="email" name="email" placeholder='Enter your email' />
          <br />
          <label htmlFor='password'>Password</label>
          <input type="password" name="password" placeholder='Enter your password' />
          <br />
          <button className="border border-white" type='submit'>{isPending ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
}
