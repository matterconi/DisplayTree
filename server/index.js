const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // This enables CORS for all origins and headers

const port = 1225;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});