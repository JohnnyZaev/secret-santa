import { Request } from 'express';

export interface User {
  id: string;
  username: string;
  password: string; // hashed
}

export interface Room {
  id: string;
  name: string;
  adminId: string;
  participants: string[]; // user IDs
  started: boolean;
  assignments?: { [userId: string]: string }; // userId -> assignedUserId
}

export interface Wishlist {
  userId: string;
  roomId: string;
  content: string;
}

export interface Database {
  users: User[];
  rooms: Room[];
  wishlists: Wishlist[];
}

export interface AuthRequest extends Request {
  userId?: string;
}

