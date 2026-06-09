import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from '@/context/SocketContext';

export const metadata = {
  title: "Chat App",
  description: "A real-time chat application built with Next.js and Socket.IO",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
