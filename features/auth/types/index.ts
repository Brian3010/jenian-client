export type LoginResponse = {
  user: User;
};

export type User = {
  userName: string;
  email: string;
  isTelegramConnected: boolean;
};

export type AuthContextType = {
  userInfo: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addUser: (userInfo: User) => void;
};
