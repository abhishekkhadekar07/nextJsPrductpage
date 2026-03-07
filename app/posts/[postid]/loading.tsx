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

      <div className={styles.content}>
        <div
          style={{
            width: '80%',
            height: '40px',
            background: '#e0e0e0',
            borderRadius: '4px',
            marginBottom: '1rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        ></div>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #eee',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '20px',
              background: '#e0e0e0',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '80px',
              height: '20px',
              background: '#e0e0e0',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
        <div
          style={{
            width: '100%',
            height: '200px',
            background: '#e0e0e0',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        ></div>
      </div>
    </div>
  );
}
