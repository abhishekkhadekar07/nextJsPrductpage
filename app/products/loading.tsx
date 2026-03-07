import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div
          className={styles.title}
          style={{
            width: '200px',
            height: '28px',
            background: '#e0e0e0',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        ></div>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              flex: '1 1 320px',
              height: '40px',
              background: '#e0e0e0',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '80px',
              height: '40px',
              background: '#e0e0e0',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
      </header>

      <main>
        <ul className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <li key={i} className={styles.card}>
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: '#f0f0f0',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              ></div>
              <div className={styles.cardBody}>
                <div
                  style={{
                    width: '80%',
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                ></div>
                <div
                  style={{
                    width: '60px',
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                ></div>
                <div
                  style={{
                    width: '100px',
                    height: '36px',
                    background: '#e0e0e0',
                    borderRadius: '6px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
