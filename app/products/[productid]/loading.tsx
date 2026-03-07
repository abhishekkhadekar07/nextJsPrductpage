import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          width: '150px',
          height: '20px',
          background: '#e0e0e0',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      ></div>

      <div className={styles.grid}>
        <div className={styles.media}>
          <div
            style={{
              width: '100%',
              height: '420px',
              background: '#f0f0f0',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>

        <div className={styles.content}>
          <div
            style={{
              width: '80%',
              height: '32px',
              background: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '120px',
              height: '28px',
              background: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '150px',
              height: '20px',
              background: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '1rem',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '100%',
              height: '100px',
              background: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '1rem',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '200px',
              height: '40px',
              background: '#e0e0e0',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
