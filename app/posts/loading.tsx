import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '150px',
              height: '28px',
              background: '#e0e0e0',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
          <div
            style={{
              width: '120px',
              height: '36px',
              background: '#e0e0e0',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
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
              <div className={styles.cardBody}>
                <div
                  style={{
                    width: '90%',
                    height: '24px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                ></div>
                <div
                  style={{
                    width: '100%',
                    height: '60px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                ></div>
                <div
                  style={{
                    width: '80px',
                    height: '16px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
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
