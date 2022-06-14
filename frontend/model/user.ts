class User {
  isLoggedIn: boolean;
  login: string;
  avatarUrl: string;

  constructor(isLoggedIn: boolean, login: string, avatarUrl: string) {
    this.isLoggedIn = isLoggedIn;
    this.login = login;
    this.avatarUrl = avatarUrl;
  }
}

export default User;
