import { createServer } from "http";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { ILogin, ISocket, IUser, LoginCallback } from "./types";
import { UserStore } from "./userStore";
import { loginSchema } from "./schemas";

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: ["http://localhost:3000"] } });

const port = process.env.PORT || 3001;

const userStore = new UserStore();

io.on("connection", (socket: ISocket): void => {
  socket.on(
    "login",
    ({ name, room }: ILogin, callback: LoginCallback): void | ISocket => {
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
        admin: false,
      });

      if (storeError) return callback({ error: storeError, user: undefined });
      // join room and notify users
      (async (): Promise<void> => {
        const allSocketsInRoom = await io.in(room).fetchSockets();
        if (allSocketsInRoom.length > 0) {
          console.log(`joining room: ${room}`);
          io.to(userStore.getRoomAdmin(room).id).emit(
            "acceptUser",
            { name, id: socket.id },
            (accepted: boolean): void => {
              if (accepted) {
                socket.name = name;
                socket.join(room);
                socket.in(room).emit("notification", {
                  title: "Someone's here",
                  description: `${name} just entered the room`,
                });
                io.in(room).emit("users", userStore.getRoomUsers(room));
                return callback({ error: undefined, user });
              }
              return callback({ error: "not authorized", user: undefined });
            }
          );
        } else {
          console.log(`creating room: ${room}`);
          socket.name = name;
          socket.join(room);
          userStore.selectNewAdmin(room);
          socket.in(room).emit("notification", {
            title: "Someone's here",
            description: `${name} just entered the room`,
          });
          io.in(room).emit("users", userStore.getRoomUsers(room));
          return callback({ error: undefined, user });
        }
      })();
    }
  );

  socket.on("logout", (callback): ISocket | undefined => {
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
      // console.log(`[${user.name}]: ${message}`);
      io.in(user.room).emit("roomMessage", { message, from: user.name });
    }
  });

  socket.on("ping", (callback): ISocket | undefined => {
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

function logout(socket: ISocket): void {
  const user = userStore.deleteUser(socket.id);
  if (user) {
    socket.leave(user.room);
    io.in(user.room).emit("notification", {
      title: "Someone just left",
      description: `${user.name} just left the room`,
    });
    io.in(user.room).emit("users", userStore.getRoomUsers(user.room));
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
