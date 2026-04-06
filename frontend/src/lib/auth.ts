const TOKEN_KEY = "civicai_admin_token";

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAdminToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function removeAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}