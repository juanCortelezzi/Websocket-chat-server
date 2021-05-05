import { createServer } from "http";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { ISocket } from "./types";

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: ["http://localhost:3000"] } });

const port = process.env.PORT || 3001;

io.on("connection", (socket: ISocket): void => {
  socket.name = "juanba";
  socket.on("joinRoom", () => {}); //TODO
  socket.on("createRoom", () => {}); //TODO
  socket.on("message", () => {}); //TODO

  socket.on("ping", (callback): void => {
    // client callback -> () => console.log("pong")
    callback();
  });
});

app.get("/", (_req: Request, res: Response): void => {
  res.send("up and running");
});

http.listen(port, (): void => {
  console.log(`server running on http://localhost:${port}`);
});
