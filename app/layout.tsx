"use client";
import "@/app/globals.css";
// import { SessionProvider} from 'next-auth/react';
import { ReactNode } from "react";
// import SessionWatcher from './tasks/_components/SessionWatcher';
// import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
