export type User = {
  id: number;
  name: string;
  user_code: string;
  role: string;
};

export type UserRead = {
  id: number;
  user_code: string;
  name: string;
  role: string;
  last_login: Date;
};
