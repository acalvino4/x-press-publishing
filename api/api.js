import express from 'express';
const api = express.Router();

import artistsRouter from './artists.js';
import seriesRouter from './series.js';
import issuesRouter from './issues.js';

api.use('/artists', artistsRouter);
api.use('/series', seriesRouter);
api.use('/issues', issuesRouter);

export default api;
