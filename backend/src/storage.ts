import fs from 'fs';
import path from 'path';
import { Database } from './types';

const DATA_FILE = path.join(__dirname, '../data.json');

const defaultData: Database = {
  users: [],
  rooms: [],
  wishlists: []
};

export class Storage {
  private data: Database;

  constructor() {
    this.data = this.load();
  }

  private load(): Database {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    return { ...defaultData };
  }

  private save(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username === username);
  }

  addUser(user: User): void {
    this.data.users.push(user);
    this.save();
  }

  // Rooms
  getRooms(): Room[] {
    return this.data.rooms;
  }

  getRoomById(id: string): Room | undefined {
    return this.data.rooms.find(r => r.id === id);
  }

  addRoom(room: Room): void {
    this.data.rooms.push(room);
    this.save();
  }

  updateRoom(room: Room): void {
    const index = this.data.rooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      this.data.rooms[index] = room;
      this.save();
    }
  }

  // Wishlists
  getWishlist(userId: string, roomId: string): Wishlist | undefined {
    return this.data.wishlists.find(w => w.userId === userId && w.roomId === roomId);
  }

  getWishlistsByRoom(roomId: string): Wishlist[] {
    return this.data.wishlists.filter(w => w.roomId === roomId);
  }

  setWishlist(wishlist: Wishlist): void {
    const index = this.data.wishlists.findIndex(
      w => w.userId === wishlist.userId && w.roomId === wishlist.roomId
    );
    if (index !== -1) {
      this.data.wishlists[index] = wishlist;
    } else {
      this.data.wishlists.push(wishlist);
    }
    this.save();
  }
}

export const storage = new Storage();

