import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { env } from './env';
import { logger } from './logger';
import { verifyAccessToken } from './jwt';

let io: SocketServer;

export const initializeSocket = (server: HTTPServer): void => {
  io = new SocketServer(server, {
    cors: { origin: [env.CLIENT_URL, env.ADMIN_URL], credentials: true },
    transports: ['websocket', 'polling'],
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = verifyAccessToken(token);
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    socket.join(`user:${user?.userId}`);
    if (user?.storeId) socket.join(`store:${user.storeId}`);
    if (user?.role === 'admin') socket.join('admins');
    if (user?.role === 'worker') socket.join(`workers:${user.storeId}`);
    socket.on('disconnect', () => logger.debug(`Socket disconnected: ${socket.id}`));
  });

  logger.info('Socket.IO initialized');
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  getIO().to(`user:${userId}`).emit(event, data);
};

export const emitToStore = (storeId: string, event: string, data: unknown): void => {
  getIO().to(`store:${storeId}`).emit(event, data);
};

export const emitToAdmins = (event: string, data: unknown): void => {
  getIO().to('admins').emit(event, data);
};
