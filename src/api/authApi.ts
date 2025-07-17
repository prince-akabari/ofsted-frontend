import api from "@/services/apiService";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "readonly";
  status: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
