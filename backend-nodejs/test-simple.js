const http = require('http');

// Test simple de connexion au serveur
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/test',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Réponse:', data);
  });
});

req.on('error', (error) => {
  console.error('Erreur de connexion:', error.message);
});

req.end();
