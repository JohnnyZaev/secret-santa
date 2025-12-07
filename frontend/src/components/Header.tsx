import React from 'react';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="header-content">
        <h1>🎅 Тайный Санта</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Привет, <strong>{user?.username}</strong>!</span>
          <button onClick={logout} className="btn btn-small">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

