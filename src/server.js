import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

const PORT = Number(env("PORT", '3000'));

export const setupServer = () => {
    const app = express();
    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );
    app.use(cors());

    app.use('*', (req, res, next) => {
        res.status(404).json({
            message: 'Page not found',
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is runninig on port ${PORT}`);
    });
};