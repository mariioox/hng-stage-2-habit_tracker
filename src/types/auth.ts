export type AuthMode = "login" | "signup";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: AuthCredentials) => void;
  error?: string;
}

export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
};