import 'reflect-metadata';
import 'dotenv/config';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import './controllers/product.controller';
import { container } from './inversify/inversify.config';
import swaggerUi from 'swagger-ui-express';
const swaggerDoc = require('./swagger/swagger.json');
import { ValidationError } from 'class-validator';
import { classValidatorError } from './middlewares/validation.middleware'; // Novo middleware

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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));