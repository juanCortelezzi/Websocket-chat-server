import { createServer } from "http";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { ILogin, LoginCallback } from "./types";
import { UserStore } from "./userStore";
import { loginSchema } from "./schemas";
import { config } from "dotenv";

config();
const endpoint = (process.env.ENDPOINT as string) || "http://localhost:3000";
const port = (process.env.PORT as string) || 3001;

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: { origin: [endpoint], methods: ["GET", " POST"] },
});

const userStore = new UserStore();

io.on("connection", (socket: Socket): void => {
  socket.on(
    "login",
    ({ name, room }: ILogin, callback: LoginCallback): void | Socket => {
      name = noLeadOrTrailWhites(name);
      room = noLeadOrTrailWhites(room);
      // field validation
      if (typeof callback !== "function") {
        return socket.disconnect();
      }
      const { error: validationError } = loginSchema.validate({ name, room });
      if (validationError) {
        return callback({ error: "No room or name provided", user: undefined });
      }
      // user validation
      const { error: storeError, user } = userStore.saveUser({
        id: socket.id,
        name,
        room,
      });

      if (storeError || !user) {
        return callback({ error: storeError, user: undefined });
      }
      socket.join(room);
      socket.in(room).emit("notification", {
        title: "Someone's here",
        description: `${name} just entered the room`,
      });
      io.in(room).emit("users", userStore.getRoomUsers(room));
      return callback({ error: undefined, user });
    }
  );

  socket.on("logout", (callback): Socket | undefined => {
    // callback validation
    if (typeof callback !== "function") {
      return socket.disconnect();
    }
    logout(socket);
    callback();
  });

  socket.on("roomMessage", (message: string): void => {
    const user = userStore.findUser(socket.id);
    if (user) {
      io.in(user.room).emit("roomMessage", { message, from: user.name });
    }
  });

  socket.on("ping", (callback): Socket | undefined => {
    // callback validation
    if (typeof callback !== "function") {
      return socket.disconnect();
    }
    // client callback -> (id) => console.log("pong", id)
    callback(socket.id);
  });

  socket.on("disconnect", (): void => {
    logout(socket);
  });
});

function logout(socket: Socket): void {
  const userInRoom = userStore.deleteUser(socket.id);
  if (userInRoom) {
    socket.leave(userInRoom.room);
    io.in(userInRoom.room).emit("notification", {
      title: "Someone just left",
      description: `${userInRoom.name} just left the room`,
    });
    io.in(userInRoom.room).emit(
      "users",
      userStore.getRoomUsers(userInRoom.room)
    );
  }
}

function noLeadOrTrailWhites(str: string): string {
  const noLeadOrTrailWhites = /(^\s+|\s+$)/;
  return str.replace(noLeadOrTrailWhites, "");
}

app.get("/", (_req: Request, res: Response): void => {
  res.send("up and running");
});

http.listen(port, (): void => {
  console.log(`server running on http://localhost:${port}`);
});
