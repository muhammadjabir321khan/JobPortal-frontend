import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  
  const [user, setUser] = useState({ data: null, isAuthenticated: false });
  const login = (data) => setUser({ data, isAuthenticated: true });
  const logout = () => setUser({ data: null, isAuthenticated: false });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
