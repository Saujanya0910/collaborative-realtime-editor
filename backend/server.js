const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket.handler');
require('dotenv');
const cors = require('cors');
const routes = require('./routes/app.route');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: ['http://localhost:5173', 'https://collaborative-realtime-editor.vercel.app'],
  methods: ['GET', 'POST']
}));
app.use(express.json());

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});

// import & use socket-handler
socketHandler(io);

// import & use API routes handler
routes(app);