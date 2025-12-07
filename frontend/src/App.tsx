import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Auth from './components/Auth';
import Header from './components/Header';
import RoomList from './components/RoomList';
import RoomDetail from './components/RoomDetail';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loader">Загрузка...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loader">Загрузка...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" /> : <Auth />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Header />
              <RoomList />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <PrivateRoute>
              <Header />
              <RoomDetail />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

