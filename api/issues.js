import express from 'express';
import sqlite from 'sqlite3';

const issues = express.Router({ mergeParams: true });
const db = new sqlite.Database(process.env.DATABASE || './database.sqlite');

issues.param('issueID', (req, res, next, issueID) => {
  db.get('SELECT * FROM Issue WHERE id=?', issueID, (err, issue) => {
    if (err) {
      next(err);
    } else if (issue) {
      req.issue = issue;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

issues.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Issue WHERE series_id=${req.series.id};`, (err, issues) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send({ issues });
    }
  });
});

issues.post('/', (req, res, next) => {
  const { issue } = req.body;
  if (issue.name && issue.issueNumber && issue.publicationDate && issue.artistId) {
    issue.seriesId = req.series.id;
    db.run(`INSERT INTO Issue (
            name, issue_number, publication_date, artist_id, series_id
        ) VALUES (
            '${issue.name}', ${issue.issueNumber}, '${issue.publicationDate}', ${issue.artistId}, ${issue.seriesId}
        );`, function(err) {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Issue WHERE id=${this.lastID};`, (err, issue) => {
          if (err) {
            next(err);
          } else {
            res.status(201).send({ issue });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

issues.put('/:issueID', (req, res, next) => {
  const { issue } = req.body;
  if (issue.name && issue.issueNumber && issue.publicationDate && issue.artistId) {
    issue.seriesId = req.series.id;
    db.run(`UPDATE Issue SET
            name='${issue.name}',
            issue_number=${issue.issueNumber},
            publication_date='${issue.publicationDate}',
            artist_id=${issue.artistId},
            series_id=${issue.seriesId}
        WHERE id=${req.issue.id};`, (err) => {
      if (err) {
        next(err);
      } else {
        db.get(`SELECT * FROM Issue WHERE id=${req.issue.id};`, (err, issue) => {
          if (err) {
            next(err);
          } else {
            res.status(200).send({ issue });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

issues.delete('/:issueID', (req, res, next) => {
  db.run(`DELETE FROM Issue WHERE id=${req.issue.id};`, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default issues;
