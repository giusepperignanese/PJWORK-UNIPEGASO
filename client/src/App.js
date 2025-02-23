import React, { lazy, Suspense, createContext, useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingSpinner from './common/LoadingSpinner';
import NotFound from './common/403';
import PageNotFound from './common/404';
import { ThemeProvider } from './common/ThemeContext';
import Login from './auth/Login';
import Reg from './auth/Register';
import CustomerHome from './customer/CustomerHome';
import ReserveSlot from './customer/ReserveSlot';
import ReservationsList from './customer/ReservationsList';

import ProfessionalDashboard from './professional/Dashboard';
import Calendar from './professional/Calendar';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return children || <Outlet />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthContext.Provider value={{ user, setUser }}>
        <ThemeProvider>
          <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Redirect alla home appropriata in base al ruolo */}
                <Route
                  path="/"
                  element={
                    user ? (
                      user.role === 'customer' ? (
                        <Navigate to="/home" />
                      ) : (
                        <Navigate to="/dashboard" />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                {/* Pagine pubbliche */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Reg />} />
                <Route path="/403" element={<NotFound />} />
                <Route path="/404" element={<PageNotFound />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute role="customer" />}>
                  <Route path="/reserve" element={<ReserveSlot />} />
                  <Route path="/home" element={<CustomerHome />} />
                  <Route path="/reservations" element={<ReservationsList />} />
                </Route>

                {/* Professional Routes */}
                <Route element={<ProtectedRoute role="professional" />}>
                  <Route path="/dashboard" element={<ProfessionalDashboard />} />
                  <Route path="/updatecalendar" element={<Calendar />} />
                </Route>

                {/* Pagina non trovata */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;