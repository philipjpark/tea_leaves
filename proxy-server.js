const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Tea-leaves Gemma API configuration
const gemmaUrl = "https://yoree-gemma-827561407333.europe-west1.run.app/v1beta/models/gemma3:4b:generateContent";

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Tea-leaves Gemma API
app.post('/api/gemma', async (req, res) => {
  try {
    console.log('🔄 Proxying request to Tea-leaves Gemma API...');
    
    const response = await axios.post(gemmaUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`,
        'User-Agent': 'Tea-Leaves-Platform/1.0'
      },
      timeout: 30000
    });
    
    console.log('✅ Tea-leaves Gemma API response received:', response.status);
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Tea-leaves proxy error:', error.message);
    res.status(500).json({
      error: 'Failed to proxy request to Tea-leaves Gemma API',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tea-Leaves Proxy Server is running',
    platform: 'Tea-Leaves v1.0',
    gemmaEndpoint: gemmaUrl
  });
});

// Tea-leaves platform status endpoint
app.get('/api/tea-leaves/status', (req, res) => {
  res.json({
    platform: 'Tea-Leaves',
    version: '1.0.0',
    status: 'operational',
    gemmaIntegration: 'active',
    factorDiscovery: 'enabled',
    aiOptimization: 'enabled'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tea-Leaves Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Tea-leaves Gemma API`);
  console.log(`🔑 API key: ${process.env.GOOGLE_CLOUD_API_KEY ? '✓ Loaded' : '✗ Missing'}`);
  console.log(`🔍 Environment check: ${process.env.GOOGLE_CLOUD_API_KEY ? 'Key length: ' + process.env.GOOGLE_CLOUD_API_KEY.length : 'No key found'}`);
  console.log(`🌐 Tea-leaves platform: v1.0.0`);
}); 