'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { connect } = useSocket();

  const handleJoin = (e) => {
    e.preventDefault();

    if (username.trim()) {
      localStorage.setItem('chat-username', username.trim());
      connect(username.trim());
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans px-4">
      <form
        onSubmit={handleJoin}
        className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-md shadow-2xl"
      >
        <h1 className="mb-2 text-3xl font-bold text-white">
          💬 Chat App
        </h1>

        <p className="mb-8 text-white/70">
          Enter your name to start chatting
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name..."
          maxLength={20}
          autoFocus
          className="mb-4 w-full rounded-xl border border-transparent bg-white px-5 py-4 text-base text-black outline-none transition focus:border-violet-500"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 px-4 py-4 text-base font-bold text-white transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Join Chat 
        </button>
      </form>
    </div>
  );
}