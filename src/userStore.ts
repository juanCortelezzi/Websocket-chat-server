interface ISessionMap {
  [key: string]: ISession;
}

interface ISession {
  username: string;
  room: string;
}

class UserStore {
  sessions: ISessionMap;
  constructor() {
    this.sessions = {};
  }

  findSession(sessionID: string): ISession {
    return this.sessions[sessionID];
  }

  saveSession({
    sessionID,
    session,
  }: {
    sessionID: string;
    session: ISession;
  }): void {
    this.sessions[sessionID] = session;
  }

  printSession(): void {
    console.log(this.sessions);
  }
}

export { UserStore };
