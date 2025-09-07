import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt, userInfo) => {
    console.log('AuthContext login called', { jwt, userInfo });
    localStorage.setItem('token', jwt);
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(jwt);
    setUser(userInfo || { token: jwt });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
