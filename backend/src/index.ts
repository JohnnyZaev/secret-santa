import express from 'express';
import cors from 'cors';
import { register, login, authMiddleware } from './auth';
import * as routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authMiddleware, routes.getMe);

// Room routes
app.post('/api/rooms', authMiddleware, routes.createRoom);
app.get('/api/rooms', authMiddleware, routes.getRooms);
app.get('/api/rooms/:id', authMiddleware, routes.getRoom);
app.post('/api/rooms/join', authMiddleware, routes.joinRoom);

// Wishlist routes
app.post('/api/wishlist', authMiddleware, routes.setWishlist);
app.get('/api/wishlist/:roomId', authMiddleware, routes.getWishlist);

// Game routes
app.post('/api/game/start', authMiddleware, routes.startGame);
app.get('/api/game/assignment/:roomId', authMiddleware, routes.getAssignment);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


