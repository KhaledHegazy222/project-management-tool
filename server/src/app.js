const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoute = require('./route/userRoute');
const projectRoute = require('./route/projectRoute');

const app = express();

app.use(cors());
// parse application/json parser
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', userRoute);
app.use('/api/v1/project', projectRoute);

app.listen(process.env.PORT, () => {
  console.log('server started...');
});
