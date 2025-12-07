import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, wishlistApi, gameApi, Room, Assignment } from '../api';
import { useAuth } from '../AuthContext';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [wishlist, setWishlist] = useState('');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wishlistSaved, setWishlistSaved] = useState(false);

  const loadRoom = async () => {
    if (!id) return;
    try {
      const roomData = await roomApi.getRoom(id);
      setRoom(roomData);
      
      const wishlistData = await wishlistApi.getWishlist(id);
      setWishlist(wishlistData.content);
      setWishlistSaved(!!wishlistData.content);
      
      if (roomData.started) {
        try {
          const assignmentData = await gameApi.getAssignment(id);
          setAssignment(assignmentData);
        } catch (err) {
          console.error('Failed to load assignment:', err);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, [id]);

  const handleSaveWishlist = async () => {
    if (!id) return;
    setError('');
    setSuccess('');
    try {
      await wishlistApi.setWishlist(id, wishlist);
      setSuccess('Список желаний сохранён!');
      setWishlistSaved(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save wishlist');
    }
  };

  const handleStartGame = async () => {
    if (!id) return;
    setError('');
    setSuccess('');
    try {
      await gameApi.startGame(id);
      setSuccess('Игра началась!');
      await loadRoom();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start game');
    }
  };

  const copyRoomId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setSuccess('ID комнаты скопирован!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return <div className="loader">Загрузка...</div>;
  }

  if (!room) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">Комната не найдена</div>
          <button className="btn" onClick={() => navigate('/')}>
            Вернуться к списку комнат
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.id === room.adminId;

  return (
    <div className="container">
      <button className="btn btn-small" onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
        ← Назад к комнатам
      </button>

      <div className="card">
        <h2>{room.name}</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <div style={{ marginBottom: '20px' }}>
          <strong>ID комнаты:</strong> {id}
          <button className="btn btn-small" onClick={copyRoomId} style={{ marginLeft: '10px' }}>
            Копировать
          </button>
        </div>

        <h3>Участники ({room.participants.length})</h3>
        <ul className="participants-list">
          {room.participants.map((participant) => (
            <li key={participant.id}>
              {participant.username}
              {participant.id === room.adminId && (
                <span className="admin-badge">АДМИН</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {!room.started && (
        <div className="card">
          <h3>Письмо Санте</h3>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Напишите, что бы вы хотели получить в подарок. Ваш Тайный Санта увидит это письмо!
          </p>
          <textarea
            value={wishlist}
            onChange={(e) => setWishlist(e.target.value)}
            placeholder="Например: Хочу новую книгу, наушники или что-то тёплое на зиму..."
          />
          <button className="btn" onClick={handleSaveWishlist}>
            Сохранить список желаний
          </button>
          {wishlistSaved && (
            <div className="success" style={{ marginTop: '10px' }}>
              ✓ Список желаний сохранён
            </div>
          )}
        </div>
      )}

      {isAdmin && !room.started && (
        <div className="card">
          <h3>Панель администратора</h3>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Когда все участники будут готовы, запустите игру. После запуска каждый участник узнает, кому он дарит подарок.
          </p>
          <button
            className="btn"
            onClick={handleStartGame}
            disabled={room.participants.length < 2}
          >
            Запустить игру
          </button>
          {room.participants.length < 2 && (
            <p style={{ marginTop: '10px', color: '#e74c3c' }}>
              Нужно минимум 2 участника для начала игры
            </p>
          )}
        </div>
      )}

      {room.started && assignment && (
        <div className="assignment-card">
          <h2>Ваш получатель:</h2>
          <div className="username">{assignment.assignedUser.username}</div>
          
          {assignment.wishlist && (
            <div className="wishlist-display">
              <h3>📝 Список желаний:</h3>
              <p>{assignment.wishlist}</p>
            </div>
          )}
          
          {!assignment.wishlist && (
            <div className="wishlist-display">
              <p>Участник пока не оставил список желаний</p>
            </div>
          )}
        </div>
      )}

      {room.started && !assignment && (
        <div className="card">
          <p>Загрузка назначения...</p>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;


