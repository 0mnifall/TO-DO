export interface AuthRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface UserStatus {
  isAuthenticated: boolean;
  username: string | null;
}
