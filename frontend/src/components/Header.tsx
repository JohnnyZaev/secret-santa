import React from 'react';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="header-content">
        <h1>🎄 Тайный Санта 💪 🎅</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#fff', fontWeight: 600 }}>
          <span style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            ❄️ Привет, <strong style={{ color: '#ffd700' }}>{user?.username}</strong>! ❄️
          </span>
          <button onClick={logout} className="btn btn-small">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;


