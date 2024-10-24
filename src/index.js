import { setupServer } from "./server";
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
    await setupServer();
    initMongoConnection();
};
bootstrap();