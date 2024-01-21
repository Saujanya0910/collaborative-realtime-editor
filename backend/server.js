const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({debug: true}); // TODO - remove debug

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json())

io.on('connection', (socket) => {
  console.log("Socket connected: ", socket.id);
});

app.get('/', (_, res) => {
  res.send('Hello from Express!');
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});

const routes = require('./routes/app.route');

routes(app);