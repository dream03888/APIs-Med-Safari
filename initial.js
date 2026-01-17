const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config({path: path.join(__dirname,'.env')});
const http = require('http');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

const PORT = dotenv.parsed.PORT;

const httpServer = http.createServer(app);
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTP Server running on port ${PORT}`);
});

const pool = new Pool({
  host: dotenv.parsed.PG_HOST,
  user: dotenv.parsed.PG_USER,
  password: dotenv.parsed.PG_PASSWORD,
  database: dotenv.parsed.PG_DATABASE,
  port: dotenv.parsed.PG_PORT
});

const io = require('socket.io')(httpServer, { 
  // path: '/helpdesk/v1',
  cors: { origin: '*' }
});



module.exports = { app, io, pool, axios };