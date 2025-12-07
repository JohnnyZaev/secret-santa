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
      <div className="christmas-decoration top-right">🎅</div>
      <div className="christmas-decoration bottom-left">🎁</div>
      <div className="christmas-decoration bottom-right">⛄</div>
    </>
  );
};

export default ChristmasDecor;

