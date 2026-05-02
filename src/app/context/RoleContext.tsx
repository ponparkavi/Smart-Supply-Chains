import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'admin' | 'operator';

interface UserInfo {
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

// Demo credentials for authentication
const DEMO_CREDENTIALS: Record<string, { password: string; role: UserRole; email: string }> = {
  'admin': { password: 'admin123', role: 'admin', email: 'admin@pulsechain.com' },
  'operator': { password: 'operator123', role: 'operator', email: 'operator@pulsechain.com' },
  'demo': { password: 'demo123', role: 'admin', email: 'demo@pulsechain.com' },
};

interface RoleContextType {
  role: UserRole;
  userInfo: UserInfo | null;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => boolean;
  register: (username: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('admin');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('pulsechain_isLoggedIn');
    const storedRole = localStorage.getItem('pulsechain_role');
    const storedUsername = localStorage.getItem('pulsechain_username');
    const storedEmail = localStorage.getItem('pulsechain_email');
    const storedUserCreatedAt = localStorage.getItem('pulsechain_userCreatedAt');
    const storedRemember = localStorage.getItem('pulsechain_rememberMe');

    if (storedLoggedIn === 'true' && storedRole) {
      setIsLoggedIn(true);
      setRoleState(storedRole as UserRole);
      if (storedUsername && storedEmail) {
        setUserInfo({
          username: storedUsername,
          email: storedEmail,
          role: storedRole as UserRole,
          createdAt: storedUserCreatedAt || undefined,
        });
      }
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (isLoggedIn) {
      localStorage.setItem('pulsechain_role', newRole);
    }
  };

  const login = (username: string, password: string, rememberMe = false): boolean => {
    // Validate credentials
    const normalizedUsername = username.toLowerCase().trim();
    const creds = DEMO_CREDENTIALS[normalizedUsername];
    
    if (!creds || creds.password !== password) {
      return false; // Invalid credentials
    }
    
    const userRole = creds.role;
    const userEmail = creds.email;
    
    setRoleState(userRole);
    setIsLoggedIn(true);
    setUserInfo({
      username: normalizedUsername,
      email: userEmail,
      role: userRole,
    });

    localStorage.setItem('pulsechain_isLoggedIn', 'true');
    localStorage.setItem('pulsechain_role', userRole);
    localStorage.setItem('pulsechain_username', normalizedUsername);
    localStorage.setItem('pulsechain_email', userEmail);
    
    if (rememberMe) {
      localStorage.setItem('pulsechain_rememberMe', 'true');
    } else {
      localStorage.removeItem('pulsechain_rememberMe');
    }
    
    return true;
  };

  const register = (username: string, email: string, _password: string, role: UserRole) => {
    const newUserInfo: UserInfo = {
      username,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setUserInfo(newUserInfo);
    setRoleState(role);
    setIsLoggedIn(true);

    localStorage.setItem('pulsechain_isLoggedIn', 'true');
    localStorage.setItem('pulsechain_role', role);
    localStorage.setItem('pulsechain_username', username);
    localStorage.setItem('pulsechain_email', email);
    localStorage.setItem('pulsechain_userCreatedAt', newUserInfo.createdAt);
    localStorage.setItem('pulsechain_rememberMe', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleState('admin');
    setUserInfo(null);
    localStorage.removeItem('pulsechain_isLoggedIn');
    localStorage.removeItem('pulsechain_role');
    localStorage.removeItem('pulsechain_rememberMe');
    localStorage.removeItem('pulsechain_username');
    localStorage.removeItem('pulsechain_email');
    localStorage.removeItem('pulsechain_userCreatedAt');
  };

  return (
    <RoleContext.Provider value={{ role, userInfo, setRole, isAdmin: role === 'admin', isLoggedIn, login, register, logout }}>
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
