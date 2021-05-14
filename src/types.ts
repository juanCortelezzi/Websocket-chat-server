import { Socket } from "socket.io";

interface ILogin {
  room: string;
  name: string;
}

type LoginCallback = ({
  error,
  user,
}: {
  error: string | undefined;
  user: IUser | undefined;
}) => void;

interface IUser {
  id: string;
  name: string;
  room: string;
  admin: boolean;
}

interface ISocket extends Socket {
  name?: string;
}

export { ILogin, LoginCallback, IUser, ISocket };
