import { IUser, SocketId } from "./types";

class UserStore {
  protected users: Map<SocketId, IUser>;
  constructor() {
    this.users = new Map();
  }

  public findUser(id: SocketId): IUser | undefined {
    return this.users.get(id);
  }

  public saveUser(user: IUser): { error?: string; user?: IUser } {
    const exists = this.users.has(user.id);
    if (exists) return { error: "user already exists" };
    this.users.set(user.id, user);
    return { user };
  }

  public deleteUser(id: SocketId): IUser | undefined {
    const user = this.users.get(id);
    if (user) {
      this.users.delete(id);
    }
    return user;
  }

  public getRoomUsers(room: string): IUser[] {
    const usersInRoom = [];
    for (let user of this.users.values()) {
      if (user.room === room) {
        usersInRoom.push(user);
      }
    }
    return usersInRoom;
  }
}

export { UserStore };
