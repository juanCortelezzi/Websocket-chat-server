import { IUser } from "./types";
type ISessionArray = IUser[];

class UserStore {
  users: ISessionArray;
  constructor() {
    this.users = [];
  }

  findUser(userID: string): IUser | undefined {
    return this.users.find((user: IUser): boolean => user.id == userID);
  }

  saveUser(user: IUser): { error?: string; user?: IUser } {
    const exists = this.users.findIndex((sUser) => sUser.id === user.id);
    if (exists !== -1) return { error: "user already exists" };
    this.users.push(user);
    return { user };
  }

  deleteUser(id: string): IUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) return this.users.splice(index, 1)[0];
  }

  getRoomUsers(room: string): IUser[] {
    return this.users.filter((user) => user.room === room);
  }

  printUsers(): void {
    console.log(this.users);
  }
}

export { UserStore };
