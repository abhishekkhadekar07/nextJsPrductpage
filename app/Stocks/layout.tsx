import type { Metadata } from "next";


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
    <>
      <h1>stocks navbar</h1>
      {children}
    </>
  );
}
