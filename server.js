require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception: ' + err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled exception');
  server.close(() => {
    process.exit(1);
  });
});
