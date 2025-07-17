import api from "@/services/apiService";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "readonly";
  status: "active" | "inactive";
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/users");
  return res.data;
};
