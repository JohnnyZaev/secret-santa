import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  username: string;
}

export interface Room {
  id: string;
  name: string;
  adminId: string;
  participants: User[];
  started: boolean;
}

export interface Assignment {
  assignedUser: User;
  wishlist: string;
}

export const authApi = {
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const roomApi = {
  createRoom: async (name: string) => {
    const response = await api.post('/rooms', { name });
    return response.data;
  },
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  getRoom: async (id: string) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  joinRoom: async (roomId: string) => {
    const response = await api.post('/rooms/join', { roomId });
    return response.data;
  },
};

export const wishlistApi = {
  setWishlist: async (roomId: string, content: string) => {
    const response = await api.post('/wishlist', { roomId, content });
    return response.data;
  },
  getWishlist: async (roomId: string) => {
    const response = await api.get(`/wishlist/${roomId}`);
    return response.data;
  },
};

export const gameApi = {
  startGame: async (roomId: string) => {
    const response = await api.post('/game/start', { roomId });
    return response.data;
  },
  getAssignment: async (roomId: string) => {
    const response = await api.get(`/game/assignment/${roomId}`);
    return response.data;
  },
};

export default api;

