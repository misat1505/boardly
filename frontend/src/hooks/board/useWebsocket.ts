"use client";
import { WebsocketEvents } from "@/constants/websocket-events";
import { Board } from "@/types/Board";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useWebsocket = (
  room: string,
  onReceiveBoard: (board: Board["content"]) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.emit(WebsocketEvents.JOIN_ROOM, room);

    socket.on(WebsocketEvents.RECEIVE_BOARD, onReceiveBoard);

    return () => {
      socket.emit(WebsocketEvents.LEAVE_ROOM, room);
      socket.disconnect();
    };
  }, [room, onReceiveBoard]);

  const sendBoard = (board: Board["content"]) => {
    if (socketRef.current) {
      socketRef.current.emit(WebsocketEvents.SEND_BOARD, board, room);
    }
  };

  return { sendBoard };
};
