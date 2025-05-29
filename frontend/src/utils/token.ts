import { jwtDecode } from "jwt-decode";

type jwtPayload = {
  exp: number;
};

export const isTokenValide = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<jwtPayload>(token);
    return exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

