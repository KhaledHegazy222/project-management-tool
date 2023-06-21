const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const queries = require('./db/queries');
const dbConnection = require('./db/connection');
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

  socket.on('send_user_invitation', async (data) => {
    const { invitedMails } = data;

    const getUserIdQuery = queries.queryList.GET_USER_ID_QUERY;
    const invitedUsersId = await Promise.all(invitedMails.map(async (invitedMail) => {
      const invitedUserId = await dbConnection.dbQuery(getUserIdQuery, [invitedMail]);
      return invitedUserId.rows[0].user_id;
    }));
    console.log('send_user_invitation', invitedUsersId);
    invitedUsersId.forEach((invitedUserId) => {
      socket.to(`user: ${invitedUserId}`).emit('receive_user_invitation');
    });
  });

  socket.on('send_join_project', (data) => {
    const { projectId } = data; // the invited user id
    console.log('send_join_project', projectId);
    socket.join(`project: ${projectId}`);
  });

  socket.on('send_task_changes', (data) => {
    const { projectId } = data;
    console.log('send_task_changes', projectId);
    socket.to(`project: ${projectId}`).emit('receive_task_changes', { projectId });
  });

  socket.on('send_task_comment', (data) => {
    const { taskId, projectId } = data;
    console.log('send_task_comment', taskId, projectId);
    socket.to(`project: ${projectId}`).emit('receive_task_comment', { taskId });
  });
});

server.listen(process.env.PORT, () => {
  console.log('server started...');
});
