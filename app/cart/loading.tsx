import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ 
          width: '300px',
          height: '28px',
          background: '#e0e0e0',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
      </div>

      <ul className={styles.cartList}>
        {[...Array(3)].map((_, i) => (
          <li key={i} className={styles.cartItem}>
            <div style={{ 
              width: '80px',
              height: '80px',
              background: '#f0f0f0',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div className={styles.itemDetails}>
              <div style={{ 
                width: '200px',
                height: '20px',
                background: '#e0e0e0',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{ 
                width: '80px',
                height: '18px',
                background: '#e0e0e0',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
            </div>
            <div className={styles.itemActions}>
              <div style={{ 
                width: '120px',
                height: '32px',
                background: '#e0e0e0',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{ 
                width: '80px',
                height: '32px',
                background: '#e0e0e0',
                borderRadius: '6px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <div style={{ 
          width: '100%',
          height: '24px',
          background: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        <div style={{ 
          width: '100%',
          height: '32px',
          background: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '1rem',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        <div style={{ 
          width: '100%',
          height: '48px',
          background: '#e0e0e0',
          borderRadius: '6px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
      </div>
    </div>
  );
}
