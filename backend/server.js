const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const routes = require('./routes/app.route');

routes(app);