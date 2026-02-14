import type { Metadata } from "next";
import styles from './stocks.module.css';

export const metadata: Metadata = {
  title: "stocks",
  description: "stocks page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layoutWrap}>
      <div className={styles.layoutBar}>Stocks Dashboard</div>
      {children}
    </div>
  );
}
