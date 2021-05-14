import { IUser } from "./types";
type ISessionArray = IUser[];

class UserStore {
  protected users: ISessionArray;
  constructor() {
    this.users = [];
  }

  public findUser(userID: string): IUser | undefined {
    return this.users.find((user: IUser): boolean => user.id == userID);
  }

  public saveUser(user: IUser): { error?: string; user?: IUser } {
    const exists = this.users.findIndex((sUser) => sUser.id === user.id);
    if (exists !== -1) return { error: "user already exists" };
    this.users.push(user);
    return { user };
  }

  public deleteUser(id: string): IUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) return this.users.splice(index, 1)[0];
  }

  public printUsers(): void {
    console.log(this.users);
  }
  public getRoomUsers(room: string): IUser[] {
    return this.users.filter((user) => user.room === room);
  }
}

export { UserStore };
