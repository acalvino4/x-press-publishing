import express from 'express';
const series = express.Router();

import sqlite from 'sqlite3';
const db = new sqlite.Database(process.env.DATABASE || './database.sqlite');

series.param('seriesID', (req, res, next, seriesID) => {
    db.get(`SELECT * FROM Series WHERE id=?`, seriesID, (err, series) => {
        if (err) {
            next(err);
        } else if (series) {
            req.series = series;
            next();
        } else {
            res.sendStatus(404);
        }
    })
})

series.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Series;`, (err, series) => {
        if (err) {
            next(err);
        } else {
            res.status(200).send({series: series})
        }
    });
})

series.get('/:seriesID', (req, res, next) => {
    res.status(200).send({series: req.series});
})

series.post('/', (req, res, next) => {
    const series = req.body.series;
    if (series.name && series.description) {
        db.run(`INSERT INTO Series (
            name, description
        ) VALUES (
            '${series.name}', '${series.description}'
        );`, function(err) {
            if (err) {
                next(err)
            } else {
                db.get(`SELECT * FROM Series WHERE id=${this.lastID}`, (err, series) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(201).send({series: series});
                    }
                })
            }
        })
    } else {
        res.sendStatus(400);
    }
})

series.put('/:seriesID', (req, res, next) => {
    const series = req.body.series;
    if (series.name && series.description) {
        db.run(`UPDATE Series SET
            name='${series.name}',
            description='${series.description}'
        WHERE id=${req.series.id};`, function(err) {
            if (err) {
                next(err)
            } else {
                db.get(`SELECT * FROM Series WHERE id=${req.series.id}`, (err, series) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(200).send({series: series});
                    }
                })
            }
        })
    } else {
        res.sendStatus(400);
    }
})

export default series;
