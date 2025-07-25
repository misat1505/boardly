import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { Events } from "./events";

dotenv.config();

const httpServer = createServer();

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on(Events.SEND_BOARD, (board, room) => {
    socket.to(room).emit(Events.RECEIVE_BOARD, board);
  });

  socket.on(Events.JOIN_ROOM, async (room) => {
    socket.join(room);
  });

  socket.on(Events.LEAVE_ROOM, (room) => {
    socket.leave(room);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Socket.IO server running on port ${process.env.PORT}`);
});
