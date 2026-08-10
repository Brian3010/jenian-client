export type LoginResponse = {
  user: GetUserResponse;
};

export type GetUserResponse = {
  userName: string;
  email: string;
  isTelegramConnected: boolean;
};

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteToken: string;
};
