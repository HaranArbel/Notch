import corsMiddleware from 'cors';
import express from 'express';
import { json } from 'body-parser';
import controller from './controller';
import { config } from './config';

const port = config.PORT;

const app = express();
app.use(corsMiddleware());
app.use(json());
app.use(controller);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

