import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';
import {swaggerDocs} from './middlewares/swaggerDocs.js'

const PORT = Number(env('PORT', '3040'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(logger);

  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts',
    });
  });

  app.use(router);
    
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
