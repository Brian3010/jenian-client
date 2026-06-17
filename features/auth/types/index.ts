export type LoginResponse = {
  user: GetUserResponse;
};

export type GetUserResponse = {
  userName: string;
  email: string;
  isTelegramConnected: boolean;
};
