import 'reflect-metadata';
import 'dotenv/config';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import './controllers/product.controller';
import './controllers/health.check.controller';
import { container } from './inversify/inversify.config';
import swaggerUi from 'swagger-ui-express';
const swaggerDoc = require('./swagger/swagger.json');
import { ValidationError } from 'class-validator';
import { classValidatorError } from './middlewares/validation.middleware'; // Novo middleware
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { PrismaClient } from '@prisma/client';

const env = dotenv.config();
dotenvExpand.expand(env);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
});

// Adicione tratamento de erros global
server.setErrorConfig((app) => {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
      return classValidatorError(err, req, res, next);
    }
    // Outros tratamentos de erro
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });
});

const app = server.build();
const PORT = process.env.PORT || 3000;
const appServer = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


async function dataBaseLoader() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso');
    //prisma.$disconnect();

  } catch (err) {
    console.error('❌ Erro ao conectar com banco de dados:', err);
    process.exit(1);
  }
  
}

// Tratamento de sinais para shutdown limpo
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`Received ${signal}, closing server...`);
    appServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    
    // Força encerramento após timeout
    setTimeout(() => {
      console.error('Forcing server shutdown');
      process.exit(1);
    }, 5000);
  });
});

dataBaseLoader();