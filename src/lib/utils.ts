import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasRole(allowed: string[]) {
  const userStr = localStorage.getItem("user");
  const role = userStr ? JSON.parse(userStr)?.role : null;
  return allowed.includes(role);
}
