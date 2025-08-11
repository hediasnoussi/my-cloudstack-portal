const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Debug server is working!' });
});

console.log('🔍 Testing routes one by one...');

// Test 1: Global routes
try {
  console.log('Testing global routes...');
  const globalRoutes = require('./routes/global');
  app.use('/api/global', globalRoutes);
  console.log('✅ Global routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading global routes:', error.message);
}

// Test 2: Compute routes
try {
  console.log('Testing compute routes...');
  const computeRoutes = require('./routes/compute');
  app.use('/api/compute', computeRoutes);
  console.log('✅ Compute routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading compute routes:', error.message);
}

// Test 3: Storage routes
try {
  console.log('Testing storage routes...');
  const storageRoutes = require('./routes/storage');
  app.use('/api/storage', storageRoutes);
  console.log('✅ Storage routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading storage routes:', error.message);
}

// Test 4: Network routes
try {
  console.log('Testing network routes...');
  const networkRoutes = require('./routes/network');
  app.use('/api/network', networkRoutes);
  console.log('✅ Network routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading network routes:', error.message);
}

// Test 5: Project routes
try {
  console.log('Testing project routes...');
  const projectRoutes = require('./routes/projects');
  app.use('/api', projectRoutes);
  console.log('✅ Project routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading project routes:', error.message);
}

app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
}); 