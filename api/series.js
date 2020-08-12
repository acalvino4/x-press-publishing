import express from 'express';
import sqlite from 'sqlite3';
import issuesRouter from './issues.js';

const series = express.Router();
const db = new sqlite.Database(process.env.DATABASE || './database.sqlite');

series.param('seriesID', (req, res, next, seriesID) => {
  db.get('SELECT * FROM Series WHERE id=?', seriesID, (err, series) => {
    if (err) {
      next(err);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

series.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series;', (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send({ series });
    }
  });
});

series.get('/:seriesID', (req, res, next) => {
  res.status(200).send({ series: req.series });
});

series.post('/', (req, res, next) => {
  const { series } = req.body;
  if (series.name && series.description) {
    db.run(`INSERT INTO Series (
            name, description
        ) VALUES (
            '${series.name}', '${series.description}'
        );`, function(err) {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Series WHERE id=${this.lastID}`, (err, series) => {
          if (err) {
            next(err);
          } else {
            res.status(201).send({ series });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

series.put('/:seriesID', (req, res, next) => {
  const { series } = req.body;
  if (series.name && series.description) {
    db.run(`UPDATE Series SET
            name='${series.name}',
            description='${series.description}'
        WHERE id=${req.series.id};`, (err) => {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Series WHERE id=${req.series.id}`, (err, series) => {
          if (err) {
            next(err);
          } else {
            res.status(200).send({ series });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

series.delete('/:seriesID', (req, res, next) => {
  db.get(`SELECT * FROM Issue WHERE series_id=${req.series.id};`, (err, issue) => {
    if (err) {
      next(err);
    } else if (issue) {
      res.sendStatus(400);
    } else {
      db.run(`DELETE FROM Series WHERE id=${req.series.id};`, (err) => {
        if (err) {
          next(err);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

series.use('/:seriesID/issues', issuesRouter);

export default series;
