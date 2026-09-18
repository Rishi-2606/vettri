const KEY = "vettri.auth";

export function loadAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

// Simple hash so raw passwords aren't stored (NOT production-safe).
// Backend will handle real auth later.
export function hashPassword(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) {
    h = (h << 5) - h + pw.charCodeAt(i);
    h |= 0;
  }
  return `h${h}`;
}

const USERS_KEY = "vettri.users";

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}