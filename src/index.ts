require('dotenv').config();
import express from 'express';
import cors from 'cors';
import router from '@/routes/routes';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { SocketController } from './controllers/socket.controller';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cookieParser());
app.use(cors());

app.use(express.static('public'));
app.use('/assets', express.static('public'));

// template view engine
app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use('*', (_req, res) => {
  res.status(404).json({ status: 404, message: '❌ Route not found!', data: null });
});

SocketController.startTrafficRecord();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('test', (msg) => {
    console.log('message: ' + msg.test);
    io.emit('test', 'Hello from server');
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
