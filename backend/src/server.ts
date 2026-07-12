import http from 'http';
import app from './app';
import { connectDatabase } from './config/database';
import { initializeSocket } from './config/socket';
import { logger } from './config/logger';
import { env } from './config/env';

const server = http.createServer(app);
initializeSocket(server);

const startServer = async () => {
  try {
    await connectDatabase();
    server.listen(env.PORT, () => {
      logger.info(`🚀 SmartQueue API running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`📚 Swagger docs: http://localhost:${env.PORT}/api/${env.API_VERSION}/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
