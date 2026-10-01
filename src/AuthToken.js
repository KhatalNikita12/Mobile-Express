// Stores the admin login token for this browser tab only (cleared when the tab closes).
const TOKEN_KEY = 'mx_admin_token';

export const readToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const saveToken = (t) => {
  try {
    if (t) sessionStorage.setItem(TOKEN_KEY, t);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore */ }
};