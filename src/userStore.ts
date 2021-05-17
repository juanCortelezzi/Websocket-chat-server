import { IUser } from "./types";
type ISessionArray = IUser[];

class UserStore {
  protected users: ISessionArray;
  constructor() {
    this.users = [];
  }

  //O(n)
  public findUser(id: string): IUser | undefined {
    return this.users.find((user: IUser): boolean => user.id == id);
  }

  //O(n)
  public saveUser(user: IUser): { error?: string; user?: IUser } {
    const exists = this.users.findIndex((sUser) => sUser.id === user.id);
    if (exists !== -1) return { error: "user already exists" };
    this.users.push(user);
    return { user };
  }

  //O(n^2)
  public deleteUser(id: string): IUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) return this.users.splice(index, 1)[0];
  }

  //O(n)
  public getRoomUsers(room: string): IUser[] {
    return this.users.filter((user) => user.room === room);
  }
}

export { UserStore };
