'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const connect = useCallback((username) => {
    const socket = connectSocket(username);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected!');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected!');
    });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-joined', (data) => {
      setOnlineUsers(data.onlineUsers);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: `${data.username} joined the chat!`,
        username: 'System',
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit'
        }),
        isSystem: true
      }]);
    });

    socket.on('user-left', (data) => {
      setOnlineUsers(data.onlineUsers);
      if (data.username) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          text: `${data.username} left the chat`,
          username: 'System',
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
          }),
          isSystem: true
        }]);
      }
    });

    socket.on('user-typing', (username) => {
      setTypingUser(username);
    });

    socket.on('user-stop-typing', () => {
      setTypingUser(null);
    });
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setIsConnected(false);
    setMessages([]);
    setOnlineUsers([]);
  }, []);

  const sendMessage = useCallback((username, text) => {
    const socket = getSocket();
    if (socket && text.trim()) {
      socket.emit('send-message', { username, text });
    }
  }, []);

  const emitTyping = useCallback((username) => {
    const socket = getSocket();
    if (socket) socket.emit('typing', username);
  }, []);

  const emitStopTyping = useCallback(() => {
    const socket = getSocket();
    if (socket) socket.emit('stop-typing');
  }, []);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return (
    <SocketContext.Provider value={{
      isConnected,
      messages,
      onlineUsers,
      typingUser,
      connect,
      disconnect,
      sendMessage,
      emitTyping,
      emitStopTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};