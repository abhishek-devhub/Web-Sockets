'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';

export default function ChatPage() {
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const router = useRouter();

  const {
    isConnected,
    messages,
    onlineUsers,
    typingUser,
    disconnect,
    connect,
    sendMessage,
    emitTyping,
    emitStopTyping
  } = useSocket();

  useEffect(() => {
    const stored = localStorage.getItem('chat-username');
    if (!stored) {
      router.push('/');
      return;
    }
    setUsername(stored);
    connect(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(username, inputValue.trim());
      setInputValue('');
      emitStopTyping();
    }
  };

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    emitTyping(username);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
    }, 2000);
  }, [username, emitTyping, emitStopTyping]);

  const handleLeave = () => {
    disconnect();
    localStorage.removeItem('chat-username');
    router.push('/');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: '#1a1a2e'
    }}>
      <div style={{
        width: '220px',
        background: '#16213e',
        padding: '20px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ marginBottom: '5px' }}>
          🟢 Online ({onlineUsers.length})
        </h3>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '10px'
        }}>
          {onlineUsers.map((user, i) => (
            <div key={i} style={{
              padding: '8px 12px',
              margin: '4px 0',
              background: user === username
                ? 'rgba(108, 92, 231, 0.3)'
                : 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {user === username ? `${user} (you)` : user}
            </div>
          ))}
        </div>
        <button onClick={handleLeave} style={{
          padding: '10px',
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Leave Chat
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '15px 20px',
          background: '#0f3460',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>💬 Chat Room</h2>
          <span style={{
            fontSize: '12px',
            color: isConnected ? '#2ecc71' : '#e74c3c'
          }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {messages.length === 0 && (
            <p style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '40px'
            }}>
              No messages yet. Say hello! 👋
            </p>
          )}

          {messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} style={{
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '13px',
                  padding: '5px'
                }}>
                  {msg.text}
                </div>
              );
            }

            const isOwn = msg.username === username;

            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: isOwn
                    ? '15px 15px 0 15px'
                    : '15px 15px 15px 0',
                  background: isOwn ? '#6c5ce7' : '#2d3436',
                  color: '#fff'
                }}>
                  {!isOwn && (
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#74b9ff',
                      marginBottom: '4px'
                    }}>
                      {msg.username}
                    </div>
                  )}
                  <div style={{ fontSize: '15px', wordBreak: 'break-word' }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && (
          <div style={{
            padding: '5px 20px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            fontStyle: 'italic'
          }}>
            {typingUser} is typing...
          </div>
        )}

        <form onSubmit={handleSend} style={{
          padding: '15px 20px',
          background: '#16213e',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '25px',
              border: 'none',
              fontSize: '15px',
              outline: 'none',
              background: '#0f3460',
              color: '#fff'
            }}
            autoFocus
          />
          <button type="submit" style={{
            padding: '12px 25px',
            borderRadius: '25px',
            border: 'none',
            background: '#6c5ce7',
            color: '#fff',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Send ➤
          </button>
        </form>
      </div>
    </div>
  );
}