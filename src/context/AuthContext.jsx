import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token   = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const name    = localStorage.getItem('name');
    const username= localStorage.getItem('username');
    return token ? { token, isAdmin, name, username } : null;
  });

  const login = (token, isAdmin, name, username) => {
  const isAdminBool = isAdmin === true || isAdmin === 'true';

  localStorage.setItem('token', token);
  localStorage.setItem('isAdmin', isAdminBool);
  localStorage.setItem('name', name);
  localStorage.setItem('username', username);

  setUser({ token, isAdmin: isAdminBool, name, username });
};

  const logout = () => { localStorage.clear(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
