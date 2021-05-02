import express, { Request, Response } from "express";
import { Socket, Server } from "socket.io";
import { createServer } from "http";
import { addUser, deleteUser, getRoomUsers, getUser } from "./users";
import { ILogin } from "./types";

const app = express();
const http = createServer(app);
const io = new Server(http);

const port = process.env.PORT || 3000;

io.on("connection", (socket: Socket): void => {
  console.log(socket.id);

  socket.on("login", ({ name, room }: ILogin, callback): void => {
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    if (user) return callback(user);
  });

  socket.on("sendMessage", (message: string): void => {
    const user = getUser(socket.id);
    if (!user) return;
    io.in(user.room).emit("message", { user, message });
  });

  socket.on("disconnect", (): void => {
    const user = deleteUser(socket.id);
    if (user) {
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
      });
      io.in(user.room).emit("users", getRoomUsers(user.room));
    }
  });
});

app.get("/", (_req: Request, res: Response): void => {
  res.send("up and running");
});

http.listen(port, (): void => {
  console.log(`server running on http://localhost:${port}`);
});
