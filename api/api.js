import express from 'express';
import artistsRouter from './artists.js';
import seriesRouter from './series.js';

const api = express.Router();

api.use('/artists', artistsRouter);
api.use('/series', seriesRouter);

export default api;
