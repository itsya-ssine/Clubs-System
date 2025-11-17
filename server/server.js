const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname,'db.sqlite'));

db.prepare(`CREATE TABLE IF NOT EXISTS club (
  club_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS activity (
  activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT,
  start_date TEXT,
  end_date TEXT,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  club_id INTEGER
)`).run();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT');
  next();
});

app.get('/api/clubs', (req,res)=>{
  const rows = db.prepare('SELECT * FROM club ORDER BY club_id DESC').all();
  res.json(rows);
});

app.post('/api/clubs', (req,res)=>{
  const {name, description, capacity} = req.body;
  const stmt = db.prepare('INSERT INTO club (name,description,capacity) VALUES (?,?,?)');
  const info = stmt.run(name, description || '', capacity || null);
  const created = db.prepare('SELECT * FROM club WHERE club_id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/clubs/:id', (req,res)=>{
  const id = req.params.id;
  db.prepare('DELETE FROM club WHERE club_id = ?').run(id);
  res.status(204).send();
});

app.get('/api/activities', (req,res)=>{
  const rows = db.prepare('SELECT * FROM activity ORDER BY activity_id DESC').all();
  res.json(rows);
});

app.post('/api/activities', (req,res)=>{
  const {title,type,start_date,end_date,start_time,end_time,location,club_id} = req.body;
  const stmt = db.prepare(`INSERT INTO activity (title,type,start_date,end_date,start_time,end_time,location,club_id)
    VALUES (?,?,?,?,?,?,?,?)`);
  const info = stmt.run(
    title,
    type,
    start_date || null,
    end_date || null,
    start_time || null,
    end_time || null,
    location || '',
    club_id || null
  );
  const created = db.prepare('SELECT * FROM activity WHERE activity_id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/activities/:id', (req,res)=>{
  const id = req.params.id;
  db.prepare('DELETE FROM activity WHERE activity_id = ?').run(id);
  res.status(204).send();
});

app.use('/', express.static(path.join(__dirname,'../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`API server listening on port ${PORT}`));
