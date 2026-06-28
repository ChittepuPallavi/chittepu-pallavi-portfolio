// app/layout.jsx

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

