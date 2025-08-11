const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Minimal test server is working!' });
});

console.log('🔍 Testing each route file individually...');

// Test 1: Global routes only
console.log('Testing global routes...');
try {
  const globalRoutes = require('./routes/global');
  app.use('/api/global', globalRoutes);
  console.log('✅ Global routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading global routes:', error.message);
  console.log('Error stack:', error.stack);
}

// Test 2: Compute routes only
console.log('Testing compute routes...');
try {
  const computeRoutes = require('./routes/compute');
  app.use('/api/compute', computeRoutes);
  console.log('✅ Compute routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading compute routes:', error.message);
  console.log('Error stack:', error.stack);
}

// Test 3: Storage routes only
console.log('Testing storage routes...');
try {
  const storageRoutes = require('./routes/storage');
  app.use('/api/storage', storageRoutes);
  console.log('✅ Storage routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading storage routes:', error.message);
  console.log('Error stack:', error.stack);
}

// Test 4: Network routes only
console.log('Testing network routes...');
try {
  const networkRoutes = require('./routes/network');
  app.use('/api/network', networkRoutes);
  console.log('✅ Network routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading network routes:', error.message);
  console.log('Error stack:', error.stack);
}

// Test 5: Project routes only
console.log('Testing project routes...');
try {
  const projectRoutes = require('./routes/projects');
  app.use('/api', projectRoutes);
  console.log('✅ Project routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading project routes:', error.message);
  console.log('Error stack:', error.stack);
}

app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
}); 