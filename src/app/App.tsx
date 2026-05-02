import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { RoleProvider, useRole } from './context/RoleContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { SearchProvider } from './components/SearchContext';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Alerts from './pages/Alerts';
import Optimization from './pages/Optimization';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRole();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRole();
  return !isLoggedIn ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/optimization" element={<ProtectedRoute><Optimization /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <PreferencesProvider>
        <SearchProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SearchProvider>
      </PreferencesProvider>
    </RoleProvider>
  );
}
