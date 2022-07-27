export type UserProp = {
  isLoggedIn: boolean;
  login: string;
  avatarUrl: string;
  uid: string;
  token: string;
  isAdmin: boolean;
};

class User {
  prop: UserProp;

  constructor(prop: UserProp) {
    this.prop = prop;
  }
}

export default User;
