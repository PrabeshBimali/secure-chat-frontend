import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [ socket, setSocket ] = useState<Socket | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        query: {
          userId: user.userid,
        }
      })

      setSocket(newSocket)

      newSocket.on("connect_error", (err) => {
        console.error("Error while connecting to socket", err)
      })

      return () => {
        newSocket.removeAllListeners()
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error("useSocket must be used within a SocketProvider")
  return context
};