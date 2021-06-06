type SocketId = string;

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
}

export { ILogin, LoginCallback, IUser, SocketId };
