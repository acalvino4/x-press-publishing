import chai from 'chai';
import request from 'supertest';
import sqlite3 from 'sqlite3';

import app from '../server.js';
import seed from './seed.js';

const { expect } = chai;

const prodDb = new sqlite3.Database('./database.sqlite');
const testDb = new sqlite3.Database(process.env.DATABASE || '.test/test.sqlite');

describe('Artist Table', () => {
  it('should exist', (done) => {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Artist'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Artist table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have name, date_of_birth, biography, and is_currently_employed columns with appropriate data types', (done) => {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ('Artist Name', 'January 1, 1980', 'My Biography', 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', (done) => {
    prodDb.run("INSERT INTO Artist (date_of_birth, biography, is_currently_employed) VALUES ('January 1, 1980', 'My Biography', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required date_of_birth column', (done) => {
    prodDb.run("INSERT INTO Artist (name, biography, is_currently_employed) VALUES ('Artist Name', 'My Biography', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without date_of_birth was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required biography column', (done) => {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, is_currently_employed) VALUES ('Artist Name', 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without biography was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('is_currently_employed should default to 1', (done) => {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, biography) VALUES ('Artist Name', 'January 1, 1980', 'My Biography')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        const artistId = this.lastID;
        prodDb.get(`SELECT * FROM Artist WHERE Artist.id = ${artistId}`, (error, artist) => {
          prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${artistId}`, () => {
            expect(artist.is_currently_employed).to.equal(1);
            done();
          });
        });
      }
    });
  });
});

describe('Series Table', () => {
  it('should exist', (done) => {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Series'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Series table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, name, and description columns with appropriate data types', (done) => {
    prodDb.run("INSERT INTO Series (name, description) VALUES ('Series Name', 'Series Description')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', (done) => {
    prodDb.run("INSERT INTO Series (description) VALUES ('Series Description')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          done(new Error('Series without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required description column', (done) => {
    prodDb.run("INSERT INTO Series (name) VALUES ('Series Name')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          done(new Error('Series without description was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('Issue Table', () => {
  it('should exist', (done) => {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Issue'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Issue table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, name, issue_number, publication_date, artist_id, and series_id columns with appropriate data types', (done) => {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', (done) => {
    prodDb.run("INSERT INTO Issue (issue_number, publication_date, artist_id, series_id) VALUES (1, 'January 1, 1980', 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required issue_number column', (done) => {
    prodDb.run("INSERT INTO Issue (name, publication_date, artist_id, series_id) VALUES ('Issue Name', 'January 1, 1980', 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without issue_number was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required publication_date column', (done) => {
    prodDb.run("INSERT INTO Issue (name, issue_number, artist_id, series_id) VALUES ('Issue Name', 1, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without publication_date was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required artist_id column', (done) => {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, series_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without artist_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required series_id column', (done) => {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without series_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('GET /api/artists', () => {
  before((done) => {
    seed.seedArtistDatabase(done);
  });

  it('should return all currently-employed artists', () => request(app)
    .get('/api/artists')
    .then((response) => {
      const { artists } = response.body;
      expect(artists.length).to.equal(2);
      expect(artists.find((artist) => artist.id === 1)).to.exist;
      expect(artists.find((artist) => artist.id === 2)).to.exist;
      expect(artists.find((artist) => artist.id === 3)).to.not.exist;
    }));

  it('should return a status code of 200', () => request(app)
    .get('/api/artists')
    .expect(200));
});

describe('GET /api/artists/:id', () => {
  before((done) => {
    seed.seedArtistDatabase(done);
  });

  it('should return the artist with the given ID', () => request(app)
    .get('/api/artists/2')
    .then((response) => {
      const { artist } = response.body;
      expect(artist.id).to.equal(2);
      expect(artist.name).to.equal('Artist 2');
      expect(artist.date_of_birth).to.equal('January 2 1980');
      expect(artist.biography).to.equal('I also work here');
      expect(artist.is_currently_employed).to.equal(1);
    }));

  it('should return a 200 status code for valid IDs', () => request(app)
    .get('/api/artists/2')
    .expect(200));

  it('should return a 404 status code for invalid IDs', () => request(app)
    .get('/api/artists/999')
    .expect(404));
});

describe('POST /api/artists', () => {
  let newArtist;

  beforeEach((done) => {
    newArtist = {
      name: 'New Artist',
      dateOfBirth: 'February 1, 1980',
      biography: 'My Biography'
    };

    seed.seedArtistDatabase(done);
  });

  it('should create a valid artist', (done) => {
    request(app)
      .post('/api/artists/')
      .send({ artist: newArtist })
      .then(() => {
        testDb.all('SELECT * FROM Artist', (error, result) => {
          if (error) {
            throw new Error(error);
          }
          const artist = result.find((artist) => artist.name === newArtist.name);
          expect(artist).to.exist;
          expect(artist.id).to.exist;
          expect(artist.date_of_birth).to.equal(newArtist.dateOfBirth);
          expect(artist.biography).to.equal(newArtist.biography);
          done();
        });
      })
      .catch(done);
  });

  it('should return a 201 status code after artist creation', () => request(app)
    .post('/api/artists/')
    .send({ artist: newArtist })
    .expect(201));

  it('should return the newly-created artist after artist creation', () => request(app)
    .post('/api/artists/')
    .send({ artist: newArtist })
    .then((response) => {
      const { artist } = response.body;
      expect(artist).to.exist;
      expect(artist.id).to.exist;
      expect(artist.name).to.equal(newArtist.name);
      expect(artist.date_of_birth).to.equal(newArtist.dateOfBirth);
      expect(artist.biography).to.equal(newArtist.biography);
    }));

  it('should set new artists as currently-employed by default', () => request(app)
    .post('/api/artists/')
    .send({ artist: newArtist })
    .then((response) => {
      const { artist } = response.body;
      expect(artist.is_currently_employed).to.equal(1);
    }));

  it('should return a 400 status code for invalid artists', () => {
    newArtist = {
      dateOfBirth: 'February 1, 1980',
      biography: 'My Biography'
    };

    return request(app)
      .post('/api/artists/')
      .send({ artist: newArtist })
      .expect(400);
  });
});

describe('PUT /api/artists/:id', () => {
  let updatedArtist;

  beforeEach((done) => {
    updatedArtist = {
      name: 'Updated Artist',
      dateOfBirth: 'February 1, 1981',
      biography: 'My New Biography',
      isCurrentlyEmployed: 1
    };

    seed.seedArtistDatabase(done);
  });

  it('should update the artist with the given ID', (done) => {
    request(app)
      .put('/api/artists/1')
      .send({ artist: updatedArtist })
      .then(() => {
        testDb.get('SELECT * FROM Artist WHERE Artist.id = 1', (error, artist) => {
          if (error) {
            throw new Error(error);
          }
          expect(artist).to.exist;
          expect(artist.id).to.equal(1);
          expect(artist.name).to.equal(updatedArtist.name);
          expect(artist.date_of_birth).to.equal(updatedArtist.dateOfBirth);
          expect(artist.biography).to.equal(updatedArtist.biography);
          expect(artist.is_currently_employed).to.equal(updatedArtist.isCurrentlyEmployed);
          done();
        });
      })
      .catch(done);
  });

  it('should return a 200 status code after artist update', () => request(app)
    .put('/api/artists/1')
    .send({ artist: updatedArtist })
    .expect(200));

  it('should return the updated artist after artist update', () => request(app)
    .put('/api/artists/1')
    .send({ artist: updatedArtist })
    .then((response) => {
      const { artist } = response.body;
      expect(artist.id).to.equal(1);
      expect(artist.name).to.equal(updatedArtist.name);
      expect(artist.date_of_birth).to.equal(updatedArtist.dateOfBirth);
      expect(artist.biography).to.equal(updatedArtist.biography);
      expect(artist.is_currently_employed).to.equal(updatedArtist.isCurrentlyEmployed);
    }));

  it('should return a 400 status code for invalid artist updates', () => {
    updatedArtist = {
      dateOfBirth: 'February 1, 1981',
      biography: 'My New Biography',
      isCurrentlyEmployed: 1
    };

    return request(app)
      .put('/api/artists/1')
      .send({ artist: updatedArtist })
      .expect(400);
  });
});

describe('DELETE /api/artists/:id', () => {
  beforeEach((done) => {
    seed.seedArtistDatabase(done);
  });

  it('should set the artist with the given ID as not currently-employed', (done) => {
    request(app)
      .del('/api/artists/1')
      .then(() => {
        testDb.get('SELECT * FROM Artist WHERE Artist.id = 1', (error, artist) => {
          if (error) {
            throw new Error(error);
          }
          expect(artist).to.exist;
          expect(artist.is_currently_employed).to.equal(0);
          done();
        });
      }).catch(done);
  });

  it('should return a 200 status code after artist delete', () => request(app)
    .del('/api/artists/1')
    .expect(200));

  it('should return the deleted artist after artist delete', () => request(app)
    .del('/api/artists/1')
    .then((response) => {
      const { artist } = response.body;
      expect(artist.id).to.equal(1);
      expect(artist.is_currently_employed).to.equal(0);
    }));
});

describe('GET /api/series', () => {
  before((done) => {
    seed.seedSeriesDatabase(done);
  });

  it('should return all series', () => request(app)
    .get('/api/series')
    .then((response) => {
      const { series } = response.body;
      expect(series.length).to.equal(3);
      expect(series.find((series) => series.id === 1)).to.exist;
      expect(series.find((series) => series.id === 2)).to.exist;
      expect(series.find((series) => series.id === 3)).to.exist;
    }));

  it('should return a status code of 200', () => request(app)
    .get('/api/series')
    .expect(200));
});

describe('GET /api/series/:id', () => {
  before((done) => {
    seed.seedSeriesDatabase(done);
  });

  it('should return the series with the given ID', () => request(app)
    .get('/api/series/2')
    .then((response) => {
      const { series } = response.body;
      expect(series.id).to.equal(2);
      expect(series.name).to.equal('Series 2');
      expect(series.description).to.equal('This is Series 2');
    }));

  it('should return a 200 status code for valid IDs', () => request(app)
    .get('/api/series/2')
    .expect(200));

  it('should return a 404 status code for invalid IDs', () => request(app)
    .get('/api/series/999')
    .expect(404));
});

describe('POST /api/series', () => {
  let newSeries;

  beforeEach((done) => {
    newSeries = {
      name: 'New Series',
      description: 'New Description'
    };

    seed.seedSeriesDatabase(done);
  });

  it('should create a valid series', () => request(app)
    .post('/api/series/')
    .send({ series: newSeries })
    .then(() => {
      testDb.all('SELECT * FROM Series', (error, result) => {
        if (error) {
          throw new Error(error);
        }
        const series = result.find((series) => series.name === newSeries.name);
        expect(series).to.exist;
        expect(series.id).to.exist;
        expect(series.name).to.equal(newSeries.name);
        expect(series.description).to.equal(newSeries.description);
      });
    }));

  it('should return a 201 status code after series creation', () => request(app)
    .post('/api/series/')
    .send({ series: newSeries })
    .expect(201));

  it('should return the newly-created series after series creation', () => request(app)
    .post('/api/series/')
    .send({ series: newSeries })
    .then((response) => {
      const { series } = response.body;
      expect(series).to.exist;
      expect(series.id).to.exist;
      expect(series.name).to.equal(newSeries.name);
      expect(series.description).to.equal(newSeries.description);
    }));

  it('should return a 400 status code for invalid series', () => {
    newSeries = {
      name: 'New Series'
    };

    return request(app)
      .post('/api/series/')
      .send({ series: newSeries })
      .expect(400);
  });
});

describe('PUT /api/series/:id', () => {
  let updatedSeries;

  beforeEach((done) => {
    updatedSeries = {
      name: 'Updated Series',
      description: 'Updated Description'
    };

    seed.seedSeriesDatabase(done);
  });

  it('should update the series with the given ID', (done) => {
    request(app)
      .put('/api/series/1')
      .send({ series: updatedSeries })
      .then(() => {
        testDb.get('SELECT * FROM Series WHERE Series.id = 1', (error, series) => {
          if (error) {
            throw new Error(error);
          }
          expect(series).to.exist;
          expect(series.id).to.equal(1);
          expect(series.name).to.equal(updatedSeries.name);
          expect(series.description).to.equal(updatedSeries.description);
          done();
        });
      })
      .catch(done);
  });

  it('should return a 200 status code after series update', () => request(app)
    .put('/api/series/1')
    .send({ series: updatedSeries })
    .expect(200));

  it('should return the updated series after series update', () => request(app)
    .put('/api/series/1')
    .send({ series: updatedSeries })
    .then((response) => {
      const { series } = response.body;
      expect(series).to.exist;
      expect(series.id).to.equal(1);
      expect(series.name).to.equal(updatedSeries.name);
      expect(series.description).to.equal(updatedSeries.description);
    }));

  it('should return a 400 status code for invalid series updates', () => {
    updatedSeries = {
      description: 'Updated Description'
    };

    return request(app)
      .put('/api/series/1')
      .send({ series: updatedSeries })
      .expect(400);
  });
});

describe('DELETE /api/series/:id', () => {
  beforeEach((done) => {
    seed.seedSeriesDatabase(done);
  });

  it('should remove the series with the specified ID from the database if that series has no related issues', () => request(app)
    .del('/api/series/1')
    .then(() => {
      testDb.get('SELECT * FROM Series WHERE Series.id = 1', (error, series) => {
        if (error) {
          throw new Error(error);
        }
        expect(series).not.to.exist;
      });
    }));

  it('should return a 204 status code after series delete', () => request(app)
    .del('/api/series/1')
    .expect(204));

  it('should not delete series with existing related issues', () => request(app)
    .del('/api/series/2')
    .then(() => {
      testDb.get('SELECT * FROM Series WHERE Series.id = 2', (error, series) => {
        if (error) {
          throw new Error(error);
        }
        expect(series).to.exist;
      });
    }));

  it('should return a 400 status code if deleted series has existing related issues', () => request(app)
    .del('/api/series/2')
    .expect(400));
});

describe('GET /api/series/:seriesId/issues', () => {
  before((done) => {
    seed.seedIssueDatabase(done);
  });

  it('should return all issues of an existing series', () => request(app)
    .get('/api/series/2/issues')
    .then((response) => {
      const { issues } = response.body;
      expect(issues.length).to.equal(2);
      expect(issues.find((issue) => issue.id === 1)).to.exist;
      expect(issues.find((issue) => issue.id === 2)).to.exist;
    }));

  it('should return an empty array for existing series with no issues', () => request(app)
    .get('/api/series/1/issues')
    .then((response) => {
      const { issues } = response.body;
      expect(issues.length).to.equal(0);
    }));

  it('should return a status code of 200 for valid series', () => request(app)
    .get('/api/series/2/issues')
    .expect(200));

  it('should return a status code of 404 for invalid series', () => request(app)
    .get('/api/series/999/issues')
    .expect(404));
});

describe('POST /api/series/:seriesId/issues', () => {
  let newIssue;

  beforeEach((done) => {
    newIssue = {
      name: 'New Issue',
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 1
    };

    seed.seedIssueDatabase(done);
  });

  it('should create a valid issue', (done) => {
    request(app)
      .post('/api/series/2/issues')
      .send({ issue: newIssue })
      .then(() => {
        testDb.all('SELECT * FROM Issue', (error, result) => {
          if (error) {
            throw new Error(error);
          }
          const issue = result.find((issue) => issue.name === newIssue.name);
          expect(issue).to.exist;
          expect(issue.id).to.exist;
          expect(issue.name).to.equal(newIssue.name);
          expect(issue.issue_number).to.equal(newIssue.issueNumber);
          expect(issue.publication_date).to.equal(newIssue.publicationDate);
          expect(issue.artist_id).to.equal(newIssue.artistId);
          expect(issue.series_id).to.equal(2);
          done();
        });
      })
      .catch(done);
  });

  it('should return a 201 status code after issue creation', () => request(app)
    .post('/api/series/2/issues')
    .send({ issue: newIssue })
    .expect(201));

  it('should return the newly-created issue after issue creation', () => request(app)
    .post('/api/series/2/issues')
    .send({ issue: newIssue })
    .then((response) => {
      const { issue } = response.body;
      expect(issue).to.exist;
      expect(issue.id).to.exist;
      expect(issue.name).to.equal(newIssue.name);
      expect(issue.issue_number).to.equal(newIssue.issueNumber);
      expect(issue.publication_date).to.equal(newIssue.publicationDate);
      expect(issue.artist_id).to.equal(newIssue.artistId);
      expect(issue.series_id).to.equal(2);
    }));

  it('should return a 400 status code for invalid issues', () => {
    newIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 1
    };

    return request(app)
      .post('/api/series/2/issues')
      .send({ issue: newIssue })
      .expect(400);
  });

  it('should return a 400 status code if an artist with the issue\'s artist ID doesn\'t exist', () => {
    newIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 999
    };

    return request(app)
      .post('/api/series/2/issues')
      .send({ issue: newIssue })
      .expect(400);
  });
});

describe('PUT /api/series/:seriesId/issues/:issueId', () => {
  let updatedIssue;

  beforeEach((done) => {
    updatedIssue = {
      name: 'Updated Issue',
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    seed.seedIssueDatabase(done);
  });

  it('should update the issue with the given ID', (done) => {
    request(app)
      .put('/api/series/2/issues/1')
      .send({ issue: updatedIssue })
      .then(() => {
        testDb.get('SELECT * FROM Issue WHERE Issue.id = 1', (error, issue) => {
          if (error) {
            throw new Error(error);
          }
          expect(issue).to.exist;
          expect(issue.id).to.equal(1);
          expect(issue.name).to.equal(updatedIssue.name);
          expect(issue.issue_number).to.equal(updatedIssue.issueNumber);
          expect(issue.publication_date).to.equal(updatedIssue.publicationDate);
          expect(issue.artist_id).to.equal(updatedIssue.artistId);
          expect(issue.series_id).to.equal(2);
          done();
        });
      })
      .catch(done);
  });

  it('should return a 200 status code after issue update', () => request(app)
    .put('/api/series/2/issues/1')
    .send({ issue: updatedIssue })
    .expect(200));

  it('should return the updated issue after issue update', () => request(app)
    .put('/api/series/2/issues/1')
    .send({ issue: updatedIssue })
    .then((response) => {
      const { issue } = response.body;
      expect(issue).to.exist;
      expect(issue.id).to.equal(1);
      expect(issue.name).to.equal(updatedIssue.name);
      expect(issue.issue_number).to.equal(updatedIssue.issueNumber);
      expect(issue.publication_date).to.equal(updatedIssue.publicationDate);
      expect(issue.artist_id).to.equal(updatedIssue.artistId);
      expect(issue.series_id).to.equal(2);
    }));

  it('should return a 404 status code for invalid issue IDs', () => {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    return request(app)
      .put('/api/series/2/issues/999')
      .send({ issue: updatedIssue })
      .expect(404);
  });

  it('should return a 400 status code for invalid issue updates', () => {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    return request(app)
      .put('/api/series/2/issues/1')
      .send({ issue: updatedIssue })
      .expect(400);
  });

  it('should return a 400 status code if an artist with the updated artist ID doesn\'t exist', () => {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 999
    };

    return request(app)
      .put('/api/series/2/issues/1')
      .send({ issue: updatedIssue })
      .expect(400);
  });
});

describe('DELETE /api/series/:seriesId/issues/:issueId', () => {
  beforeEach((done) => {
    seed.seedIssueDatabase(done);
  });

  it('should remove the issue with the specified ID from the database', (done) => {
    request(app)
      .del('/api/series/2/issues/1')
      .then(() => {
        testDb.get('SELECT * FROM Issue WHERE Issue.id = 1', (error, issue) => {
          if (error) {
            throw new Error(error);
          }
          expect(issue).not.to.exist;
          done();
        });
      }).catch(done);
  });

  it('should return a 204 status code after issue delete', () => request(app)
    .del('/api/series/2/issues/1')
    .expect(204));

  it('should return a 404 status code for invalid issue IDs', () => request(app)
    .del('/api/series/2/issues/999')
    .expect(404));
});
