import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import morgan from 'morgan';

import './env.js';
import apiRouter from './api/api.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})

export default app;
