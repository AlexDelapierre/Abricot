export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthData {
  user: User;
  token: string;
}
