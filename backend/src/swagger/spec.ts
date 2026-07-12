import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartQueue Enterprise API',
      version: '1.0.0',
      description: 'AI-powered mobile self-checkout ecosystem API',
      contact: { name: 'SmartQueue Team', email: 'api@smartqueue.com' },
    },
    servers: [
      { url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`, description: 'Development' },
      { url: `https://api.smartqueue.com/api/${env.API_VERSION}`, description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
