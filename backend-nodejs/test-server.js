const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 