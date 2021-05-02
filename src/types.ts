interface ILogin {
  room: string;
  name: string;
}

interface IUser {
  id: string;
  name: string;
  room: string;
}

export { ILogin, IUser };
