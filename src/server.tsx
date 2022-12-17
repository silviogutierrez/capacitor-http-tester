import express from 'express';
import path from "path";

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
})

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.js'));
})

app.get('/api/simple/', (req, res) => {
  res.json({ thisThing: 'Works' })
})

app.get('/api/cookie/', (req, res) => {
  res.cookie('cookie', 'test');
  res.json({ cookie: 'was set' })
})

app.listen(port, () => {
  console.log(`Test app listening on port ${port}`)
})
