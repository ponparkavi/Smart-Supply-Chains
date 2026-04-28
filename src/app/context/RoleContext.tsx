import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'admin' | 'operator';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (role: UserRole, rememberMe?: boolean) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('pulsechain_isLoggedIn');
    const storedRole = localStorage.getItem('pulsechain_role');
    const storedRemember = localStorage.getItem('pulsechain_rememberMe');

    if (storedLoggedIn === 'true' && storedRole) {
      setIsLoggedIn(true);
      setRoleState(storedRole as UserRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (isLoggedIn) {
      localStorage.setItem('pulsechain_role', newRole);
    }
  };

  const login = (selectedRole: UserRole, rememberMe = false) => {
    setRoleState(selectedRole);
    setIsLoggedIn(true);

    localStorage.setItem('pulsechain_isLoggedIn', 'true');
    localStorage.setItem('pulsechain_role', selectedRole);
    if (rememberMe) {
      localStorage.setItem('pulsechain_rememberMe', 'true');
    } else {
      localStorage.removeItem('pulsechain_rememberMe');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleState('admin');
    localStorage.removeItem('pulsechain_isLoggedIn');
    localStorage.removeItem('pulsechain_role');
    localStorage.removeItem('pulsechain_rememberMe');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isAdmin: role === 'admin', isLoggedIn, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

