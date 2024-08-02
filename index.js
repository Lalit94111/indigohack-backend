const express = require('express');
const sequelize = require('./database');
require('dotenv').config();
const userRoutes = require('./Routes/User');
const flightRoutes = require('./Routes/Flight');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const Port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', // Adjust this to the specific origin if needed
    methods: ['GET', 'POST']
  }
});

const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('registerUser', (user_id) => {
    // console.log(user_id,socket.id)
    socket.join(user_id);
    console.log(`User ${user_id} joined room`);
  });

  socket.on('disconnect', () => {
    for (let [user_id, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(user_id);
        break;
      }
    }
    console.log('User disconnected');
  });
});

app.use('/user', userRoutes);
app.use('/flight', flightRoutes(io));

app.use('/', (req, res) => {
  res.status(200).json({
    "message": "Hello World"
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    detail: error.detail || "",
    statusCode: error.statusCode || 500
  });
});

sequelize.authenticate()
  .then(() => {
    console.log("Database Connected");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    server.listen(Port, () => {
      console.log("App is running on Port", Port);
    });
  })
  .catch((err) => {
    console.log("Error Connecting Database", err);
  });

  module.exports = {userSocketMap}
