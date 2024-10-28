import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Import the routes
import routes from './routes/index.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));

  app.get('*', (_req, res) => {
    res.sendFile('../client/dist/index.html');
  });
}

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
