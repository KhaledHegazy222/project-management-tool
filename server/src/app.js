const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const verifySocketHelper = require('./middlewares/verifySocketHelper');
const userRoute = require('./route/userRoute');
const projectRoute = require('./route/projectRoute');
const requestRoute = require('./route/requestRoute');
const taskRoute = require('./route/taskRoute');

const app = express();
const server = http.createServer(app);

app.use(cors());
// parse application/json parser
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', userRoute);
app.use('/api/v1/project', projectRoute);
app.use('/api/v1/request', requestRoute);
app.use('/api/v1/task', taskRoute);

// socket
const io = new Server(server);

io.use(verifySocketHelper.verifySocket);

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('send_task_comment', (data) => {
    const { taskId } = data;
    console.log('send_task_comment', taskId, socket.projectId);
    socket.to(socket.projectId).emit('receive_task_comment', { taskId });
  });

  socket.on('send_create_task', () => {
    console.log('send_create_task', socket.projectId);
    socket.to(socket.projectId).emit('receive_task_create', { projectId: socket.projectId });
  });
});

server.listen(process.env.PORT, () => {
  console.log('server started...');
});
