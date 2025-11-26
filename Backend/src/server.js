const express = require('express');
const db = require('./db'); // Import the database connection

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST,GET,OPTIONS,PUT,DELETE,PATCH'
  );
  next();
});

// login
app.post('/login', (req, res) => {
  db.query(
    `SELECT id, name, type FROM user WHERE username='${req.body.user}' AND password='${req.body.password}'`,
    (err, results) => {
      if (err) {
        console.error('Error login user:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});

// Basic route to fetch data
app.get('/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});
app.post('/users', (req, res) => {
  const data = req.body;
  const createDate = new Date().toLocaleString('es-mx', {
    timeZone: 'America/Mexico_City',
    hour12: false,
  });

  db.query(
    `INSERT INTO user (username, password, name, date) VALUES ('${data.username}','${data.password}','${data.name}', '${createDate}')`,
    (err, results) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});
app.patch('/users/:id', (req, res) => {
  const params = req.params;
  const body = req.body;

  db.query(
    `UPDATE user SET name='${body.name}', username='${body.username}', password='${body.password}' WHERE id=${params.id}`,
    (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});
app.delete('/users/:id', (req, res) => {
  db.query(`DELETE FROM user WHERE id=${req.params.id}`, (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/gifts', (req, res) => {
  db.query('SELECT * FROM gift', (err, results) => {
    if (err) {
      console.error('Error fetching gifts:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});
app.post('/gifts', (req, res) => {
  const data = req.body; 

  db.query(
    `INSERT INTO gift (title, image, description, links, status) 
    VALUES ('${data.title}','${data.image}','${data.description}','${JSON.stringify(data.links)}',  0)`,
    (err, results) => {
      if (err) {
        console.error('Error creating gift:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});
app.patch('/gifts/:id', (req, res) => {
  const body = req.body;

  db.query(
    `UPDATE gift 
    SET title='${body.title}', image='${body.image}', description='${body.description}', links='${JSON.stringify(body.links)}' 
    WHERE id=${req.params.id}`,
    (err, results) => {
      if (err) {
        console.error('Error updating gift:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});
app.patch('/gifts/block/:id', (req, res) => {
  const data = req.body;
  const purchaseDate = new Date().toLocaleString('es-mx', {
    timeZone: 'America/Mexico_City',
    hour12: true,
  });
  db.query(
    `UPDATE gift 
    SET status=1, username='${data.username}', email='${data.email}', purchase_date='${purchaseDate}' 
    WHERE id=${req.params.id} AND status=0`,
    (err, results) => {
      if (err) {
        console.error('Error blocking gift:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    }
  );
});
app.delete('/gifts/:id', (req, res) => {
  db.query(`DELETE FROM gift WHERE id=${req.params.id}`, (err, results) => {
    if (err) {
      console.error('Error deleting gift:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
