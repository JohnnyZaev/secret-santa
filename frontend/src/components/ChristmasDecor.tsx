import React, { useEffect, useState } from 'react';

const ChristmasDecor: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Создаём снежинки
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      {/* Снег */}
      <div className="snow">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Гирлянда */}
      <div className="christmas-lights">
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
        <div className="light"></div>
      </div>

      {/* Новогодние украшения по углам */}
      <div className="christmas-decoration top-left">🎄</div>
      <div className="christmas-decoration top-right">
        🎅
        <span style={{ fontSize: '20px', marginLeft: '5px' }}>💪</span>
      </div>
      <div className="christmas-decoration bottom-left">🎁</div>
      <div className="christmas-decoration bottom-right">⛄</div>
      
      {/* Дополнительный новогодний декор */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '20px',
        fontSize: '35px',
        animation: 'float 4s ease-in-out infinite',
        animationDelay: '0.5s',
        zIndex: 5,
        pointerEvents: 'none'
      }}>🔔</div>
      
      <div style={{
        position: 'fixed',
        top: '50%',
        right: '20px',
        fontSize: '35px',
        animation: 'float 4s ease-in-out infinite',
        animationDelay: '1.5s',
        zIndex: 5,
        pointerEvents: 'none'
      }}>✨</div>
    </>
  );
};

export default ChristmasDecor;

