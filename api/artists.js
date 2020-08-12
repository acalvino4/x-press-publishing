import express from 'express';
import sqlite from 'sqlite3';

const artists = express.Router();
const db = new sqlite.Database(process.env.DATABASE || './database.sqlite');

artists.param('artistID', (req, res, next, artistID) => {
  db.get('SELECT * FROM Artist WHERE id=?', artistID, (err, artist) => {
    if (err) {
      next(err);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

artists.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE is_currently_employed=1;', (err, artists) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send({ artists });
    }
  });
});

artists.get('/:artistID', (req, res, next) => {
  res.status(200).send({ artist: req.artist });
});

artists.post('/', (req, res, next) => {
  const { artist } = req.body;
  if (artist.name && artist.dateOfBirth && artist.biography) {
    if (artist.isCurrentlyEmployed !== 0) {
      artist.isCurrentlyEmployed = 1;
    }
    db.run(`INSERT INTO Artist (
            name, date_of_birth, biography, is_currently_employed
        ) VALUES (
            '${artist.name}', '${artist.dateOfBirth}', '${artist.biography}', ${artist.isCurrentlyEmployed}
        );`, [], function(err) {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Artist WHERE id=${this.lastID};`, [], (err, artist) => {
          if (err) {
            next(err);
          } else {
            res.status(201).send({ artist });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

artists.put('/:artistID', (req, res, next) => {
  const { artist } = req.body;
  if (artist.name && artist.dateOfBirth && artist.biography) {
    if (artist.isCurrentlyEmployed !== 0) {
      artist.isCurrentlyEmployed = 1;
    }
    db.run(`UPDATE Artist SET
            name='${artist.name}',
            date_of_birth='${artist.dateOfBirth}',
            biography='${artist.biography}',
            is_currently_employed=${artist.isCurrentlyEmployed}
        WHERE id=${req.artist.id};`, (err) => {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Artist WHERE id=${req.artist.id};`, [], (err, artist) => {
          if (err) {
            next(err);
          } else {
            res.status(200).send({ artist });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

artists.delete('/:artistID', (req, res, next) => {
  db.run(`UPDATE Artist SET is_currently_employed=0 WHERE id=${req.artist.id};`, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Artist WHERE id=${req.artist.id};`, [], (err, artist) => {
        if (err) {
          next(err);
        } else {
          res.status(200).send({ artist });
        }
      });
    }
  });
});

export default artists;
