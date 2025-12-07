import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi, Room } from '../api';

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadRooms = async () => {
    try {
      const data = await roomApi.getRooms();
      setRooms(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const room = await roomApi.createRoom(roomName);
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create room');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await roomApi.joinRoom(roomId);
      navigate(`/room/${roomId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join room');
    }
  };

  if (loading) {
    return <div className="loader">Загрузка...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Мои комнаты</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="actions">
          <button
            className="btn"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowJoinForm(false);
            }}
          >
            Создать комнату
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowJoinForm(!showJoinForm);
              setShowCreateForm(false);
            }}
          >
            Присоединиться к комнате
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateRoom} style={{ marginTop: '20px' }}>
            <div className="input-group">
              <label>Название комнаты</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                placeholder="Новогодняя вечеринка 2024"
              />
            </div>
            <button type="submit" className="btn">Создать</button>
          </form>
        )}

        {showJoinForm && (
          <form onSubmit={handleJoinRoom} style={{ marginTop: '20px' }}>
            <div className="input-group">
              <label>ID комнаты</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                placeholder="Введите ID комнаты"
              />
            </div>
            <button type="submit" className="btn btn-secondary">Присоединиться</button>
          </form>
        )}
      </div>

      <div className="room-list">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <h3>{room.name}</h3>
            <div>
              <span className={`room-badge ${room.started ? 'started' : ''}`}>
                {room.started ? 'Игра началась' : 'Ожидание'}
              </span>
              <span className="room-badge">
                {room.participants.length} участников
              </span>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            У вас пока нет комнат. Создайте новую или присоединитесь к существующей!
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomList;


