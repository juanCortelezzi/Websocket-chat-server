import { Socket } from "socket.io";

interface ILogin {
  room: string;
  name: string;
}

interface IUser {
  id: string;
  name: string;
  room: string;
}

interface ISocket extends Socket {
  name?: string;
}

export { ILogin, IUser, ISocket };
