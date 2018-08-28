export class User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  // TODO add more User Info
}

export class UserSession {
  user: User;
  lastLogin: Date;
  created: Date;
  userAgent: string;
}
