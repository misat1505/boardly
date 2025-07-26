"use client";
import { io, Socket } from "socket.io-client";
import { WebsocketEvents } from "@/constants/websocket-events";
import { Board } from "@/types/Board";

type Room = Board["id"];

class WebsocketClient {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log("Connected to socket.");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket.");
    });
  }

  joinRoom(room: Room) {
    console.log("join room", room);
    this.socket.emit(WebsocketEvents.JOIN_ROOM, room);
  }

  leaveRoom(room: Room) {
    console.log("leave room", room);
    this.socket.emit(WebsocketEvents.LEAVE_ROOM, room);
  }

  sendBoard(board: Board["content"], room: Room) {
    this.socket.emit(WebsocketEvents.SEND_BOARD, board, room);
  }

  onReceiveMessage(callback: (board: Board["content"]) => void) {
    this.socket.on(WebsocketEvents.RECEIVE_BOARD, callback);
  }
}

export const websocketClient = new WebsocketClient(
  process.env.NEXT_PUBLIC_WEBSOCKET_URL!
);
