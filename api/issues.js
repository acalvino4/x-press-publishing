import express from 'express';
const issues = express.Router();

import sqlite from 'sqlite3';
const db = new sqlite.Database(process.env.DATABASE || './database.sqlite');



export default issues;
