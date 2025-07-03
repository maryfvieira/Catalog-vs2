import 'reflect-metadata';
import 'dotenv/config';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import './controllers/product.controller';
import { container } from './inversify/inversify.config';
import swaggerUi from 'swagger-ui-express';
const swaggerDoc = require('./swagger/swagger.json');

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
});

const app = server.build();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));