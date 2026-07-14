export const API_URL =
  import.meta.env.VITE_API_URL || "https://reader-realm-v18i.onrender.com";

const TOKEN_KEY = "authToken";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const authHeaders = (
  extra: Record<string, string> = {}
): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
