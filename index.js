require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');

mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on('error', (error) => {
  console.error('Database connection error:', error);
});

database.once('open', () => {
  console.log('Database connected');
});

const app = express();
app.use(express.json());
app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
