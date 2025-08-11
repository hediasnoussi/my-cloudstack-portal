const express = require('express');
const app = express();
const PORT = 3004;

app.use(express.json());

console.log('🔍 Testing routes one by one to find the problematic one...');

// Test 1: Just the base route
console.log('Testing base route...');
app.get('/', (req, res) => {
  res.json({ message: 'Base route works!' });
});

// Test 2: Global routes
console.log('Testing global routes...');
try {
  const globalRoutes = require('./routes/global');
  app.use('/api/global', globalRoutes);
  console.log('✅ Global routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading global routes:', error.message);
}

// Test 3: Compute routes
console.log('Testing compute routes...');
try {
  const computeRoutes = require('./routes/compute');
  app.use('/api/compute', computeRoutes);
  console.log('✅ Compute routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading compute routes:', error.message);
}

// Test 4: Storage routes
console.log('Testing storage routes...');
try {
  const storageRoutes = require('./routes/storage');
  app.use('/api/storage', storageRoutes);
  console.log('✅ Storage routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading storage routes:', error.message);
}

// Test 5: Network routes
console.log('Testing network routes...');
try {
  const networkRoutes = require('./routes/network');
  app.use('/api/network', networkRoutes);
  console.log('✅ Network routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading network routes:', error.message);
}

// Test 6: Project routes
console.log('Testing project routes...');
try {
  const projectRoutes = require('./routes/projects');
  app.use('/api', projectRoutes);
  console.log('✅ Project routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading project routes:', error.message);
}

// Test 7: 404 handler
console.log('Testing 404 handler...');
app.use('/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('All routes loaded successfully!');
}); 