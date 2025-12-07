import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { AuthRequest, Room } from './types';
import { assignSecretSantas } from './secretSanta';

export function getMe(req: AuthRequest, res: Response) {
  const user = storage.getUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, username: user.username });
}

export function createRoom(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Room name required' });
    }

    const room: Room = {
      id: uuidv4(),
      name,
      adminId: req.userId!,
      participants: [req.userId!],
      started: false
    };

    storage.addRoom(room);
    res.json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function getRooms(req: AuthRequest, res: Response) {
  const rooms = storage.getRooms()
    .filter(r => r.participants.includes(req.userId!))
    .map(r => {
      const participants = r.participants.map(id => {
        const user = storage.getUserById(id);
        return { id, username: user?.username || 'Unknown' };
      });
      return {
        ...r,
        participants
      };
    });
  res.json(rooms);
}

export function getRoom(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const room = storage.getRoomById(id);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (!room.participants.includes(req.userId!)) {
    return res.status(403).json({ error: 'Not a participant' });
  }

  const participants = room.participants.map(userId => {
    const user = storage.getUserById(userId);
    return { id: userId, username: user?.username || 'Unknown' };
  });

  res.json({
    ...room,
    participants
  });
}

export function joinRoom(req: AuthRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const room = storage.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.started) {
      return res.status(400).json({ error: 'Game already started' });
    }

    if (room.participants.includes(req.userId!)) {
      return res.status(400).json({ error: 'Already in room' });
    }

    room.participants.push(req.userId!);
    storage.updateRoom(room);

    const participants = room.participants.map(userId => {
      const user = storage.getUserById(userId);
      return { id: userId, username: user?.username || 'Unknown' };
    });

    res.json({
      ...room,
      participants
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function setWishlist(req: AuthRequest, res: Response) {
  try {
    const { roomId, content } = req.body;

    if (!roomId || content === undefined) {
      return res.status(400).json({ error: 'Room ID and content required' });
    }

    const room = storage.getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.participants.includes(req.userId!)) {
      return res.status(403).json({ error: 'Not a participant' });
    }

    storage.setWishlist({
      userId: req.userId!,
      roomId,
      content
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Set wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function getWishlist(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const wishlist = storage.getWishlist(req.userId!, roomId);
  res.json({ content: wishlist?.content || '' });
}

export function startGame(req: AuthRequest, res: Response) {
  try {
    const { roomId } = req.body;
    const room = storage.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.adminId !== req.userId!) {
      return res.status(403).json({ error: 'Only admin can start game' });
    }

    if (room.started) {
      return res.status(400).json({ error: 'Game already started' });
    }

    if (room.participants.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 participants' });
    }

    room.assignments = assignSecretSantas(room.participants);
    room.started = true;
    storage.updateRoom(room);

    res.json({ success: true });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function getAssignment(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const room = storage.getRoomById(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (!room.participants.includes(req.userId!)) {
    return res.status(403).json({ error: 'Not a participant' });
  }

  if (!room.started || !room.assignments) {
    return res.status(400).json({ error: 'Game not started yet' });
  }

  const assignedUserId = room.assignments[req.userId!];
  const assignedUser = storage.getUserById(assignedUserId);
  const wishlist = storage.getWishlist(assignedUserId, roomId);

  res.json({
    assignedUser: {
      id: assignedUserId,
      username: assignedUser?.username || 'Unknown'
    },
    wishlist: wishlist?.content || ''
  });
}

