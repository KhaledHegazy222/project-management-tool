const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoute = require('./route/userRoute');

const app = express();

app.use(cors());
// parse application/json parser
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', userRoute);

app.listen(process.env.PORT, () => {
  console.log('server started...');
});
