export interface IUser {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string;
}

export interface IUserWithToken extends IUser {
  token: string;
}

// 🎯 Type pour le payload JWT (données stockées dans le token)
export interface JwtPayload {
  id: number;
  username: string;
  email: string;
}
