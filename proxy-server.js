const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3002;

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

// Imagen API proxy endpoint
app.post('/api/imagen', async (req, res) => {
  try {
    console.log('🎨 Proxying request to Google Imagen API...');
    console.log('📤 Request body:', JSON.stringify(req.body, null, 2));
    
    // Use the correct Imagen API endpoint with v1beta and proper model ID
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:generate', {
      prompt: {
        text: req.body.prompt.text
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GOOGLE_CLOUD_API_KEY,
        'User-Agent': 'Tea-Leaves-Platform/1.0'
      },
      timeout: 60000
    });
    
    console.log('✅ Imagen API response received:', response.status);
    
    // Extract and return clean image data
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const candidate = response.data.candidates[0];
      if (candidate.image && candidate.image.data) {
        res.json({
          b64: candidate.image.data,
          contentType: candidate.image.mimeType || 'image/png'
        });
      } else {
        res.status(500).json({
          error: 'No image data in response',
          details: 'Response missing image data'
        });
      }
    } else {
      res.status(500).json({
        error: 'Invalid response format',
        details: 'Response missing candidates'
      });
    }
    
  } catch (error) {
    console.error('❌ Imagen API proxy error:', error.message);
    if (error.response) {
      console.error('❌ Error response:', error.response.status, error.response.data);
    }
    res.status(500).json({
      error: 'Failed to proxy request to Google Imagen API',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tea-Leaves Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Tea-leaves Gemma API`);
  console.log(`🔑 API key: ${process.env.GOOGLE_CLOUD_API_KEY ? '✓ Loaded' : '✗ Missing'}`);
  console.log(`🌐 Tea-leaves platform: v1.0.0`);
}); 