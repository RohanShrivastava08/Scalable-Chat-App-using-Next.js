"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => void;
  messages: string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Socket context is undefined!");
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([])

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      if (socket) {
        socket.emit("event:message", { message: msg });
        console.log("Send Message:", msg);
      } else {
        console.error("Socket is not initialized");
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log('From Server Msg Rec', msg);
    const {message} = JSON.parse(msg) as {message: string}
    setMessages((prev) => [...prev, message]);
  }, [])

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec)

    setSocket(_socket);

   

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec)
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
