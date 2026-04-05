import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export function useSocket(onNewsAlert, onDigestReady) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user || socketRef.current) return;

    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('subscribe', user.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    if (onNewsAlert) {
      socket.on('news_alert', onNewsAlert);
    }

    if (onDigestReady) {
      socket.on('digest_ready', onDigestReady);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return socketRef.current;
}