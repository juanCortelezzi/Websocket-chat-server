import { IUser } from "./types";

let users: IUser[] = [];

function addUser({ id, name, room }: IUser): { error?: string; user?: IUser } {
  console.log("added user:", id, name, room);
  const existingUser = users.find(
    (user): boolean =>
      user.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (existingUser) return { error: "Username has already been taken" };
  if (!name && !room) return { error: "Username and room are required" };
  if (!name) return { error: "Username is required" };
  if (!room) return { error: "Room is required" };

  const user: IUser = { id, name, room };
  users.push(user);
  return { user };
}

function getUser(id: string): IUser | undefined {
  let user = users.find((user) => user.id == id);
  return user;
}

function deleteUser(id: string): IUser | undefined {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

function getRoomUsers(room: string): IUser[] {
  return users.filter((user) => user.room === room);
}

export { addUser, getUser, deleteUser, getRoomUsers };
