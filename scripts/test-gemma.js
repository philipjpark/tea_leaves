#!/usr/bin/env node

/**
 * Test script for tea-leaves Gemma 3-4B integration
 * Tests the Google Cloud AI integration with Gemma model for tea-leaves agent functionality
 */

const http = require('http');

const GEMMA_URL = 'http://localhost:3002';

// Test prompt for tea-leaves agent strategy generation
const testPrompt = {
  contents: [{
    parts: [{
      text: "You are an expert tea-leaves agent specializing in quantitative trading and market analysis. Generate a simple trading strategy for Bitcoin (BTC) with moderate risk tolerance. Include entry/exit rules and risk management. Focus on tea-leaves specific indicators and patterns."
    }]
  }],
  generationConfig: {
    maxOutputTokens: 256,
    temperature: 0.7,
    topP: 0.9,
    topK: 40
  }
};

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/gemma',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('📥 Raw response received:', responseData);
          const parsed = JSON.parse(responseData);
          console.log('📋 Parsed response:', JSON.stringify(parsed, null, 2));
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testGemmaConnection() {
  console.log('🧪 Testing tea-leaves Gemma 3-4B Integration...');
  console.log(`🌐 Gemma URL: ${GEMMA_URL}`);
  console.log('');

  try {
    console.log('📡 Sending test request to Gemma...');
    const response = await makeRequest(GEMMA_URL, testPrompt);
    
    console.log('✅ Gemma connection successful!');
    console.log('');
    
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const generatedText = candidate.content.parts[0].text;
        console.log('🤖 Generated Tea-Leaves Trading Strategy:');
        console.log('─'.repeat(50));
        console.log(generatedText);
        console.log('─'.repeat(50));
        console.log('');
        
        console.log('📊 Response Metadata:');
        console.log(`- Model: ${response.model || 'Unknown'}`);
        console.log(`- Finish Reason: ${candidate.finishReason || 'Unknown'}`);
        console.log('');
        
        console.log('🎉 tea-leaves Gemma integration is working perfectly!');
        console.log('🚀 Your tea-leaves AI agents can now use this powerful model for strategy generation.');
      } else {
        console.log('⚠️  No content generated in response');
      }
    } else {
      console.log('⚠️  No candidates in response');
    }
    
  } catch (error) {
    console.error('❌ Error testing Gemma connection:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('1. Check if the Gemma service is running');
    console.log('2. Verify the URL is correct');
    console.log('3. Check Google Cloud Run service status');
    console.log('4. Ensure the service allows unauthenticated access');
  }
}

async function testTeaLeavesAgentPrompts() {
  console.log('📈 Testing Tea-Leaves Agent-Specific Prompts...');
  console.log('');

  const teaLeavesPrompts = [
    {
      name: 'Tea-Leaves Market Analysis',
      prompt: 'As a tea-leaves agent, analyze the current market conditions for Bitcoin (BTC). Provide a brief analysis of trend, support/resistance, and trading recommendations using tea-leaves specific indicators.',
      max_tokens: 200
    },
    {
      name: 'Tea-Leaves Risk Assessment',
      prompt: 'As a tea-leaves risk management agent, assess the risk profile for a portfolio with 60% Bitcoin, 30% Ethereum, and 10% cash. Provide a risk score (0-100) and key risk factors using tea-leaves methodology.',
      max_tokens: 150
    },
    {
      name: 'Tea-Leaves Portfolio Optimization',
      prompt: 'As a tea-leaves portfolio optimization agent, suggest portfolio optimization for a crypto portfolio with moderate risk tolerance. Include target allocations and rebalancing recommendations based on tea-leaves principles.',
      max_tokens: 200
    },
    {
      name: 'Tea-Leaves Strategy Generation',
      prompt: 'Generate a tea-leaves specific trading strategy for Ethereum (ETH) that incorporates volatility analysis, momentum indicators, and risk management rules suitable for tea-leaves agents.',
      max_tokens: 250
    }
  ];

  for (const promptData of teaLeavesPrompts) {
    try {
      console.log(`🔍 Testing: ${promptData.name}`);
      const response = await makeRequest(GEMMA_URL, {
        contents: [{
          parts: [{
            text: promptData.prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: promptData.max_tokens,
          temperature: 0.7
        }
      });
      
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = response.candidates[0].content.parts[0].text;
        console.log(`✅ ${promptData.name} - Generated response (${text.length} characters)`);
      } else {
        console.log(`⚠️  ${promptData.name} - No response generated`);
      }
      
    } catch (error) {
      console.log(`❌ ${promptData.name} - Error: ${error.message}`);
    }
    
    console.log('');
  }
}

async function main() {
  console.log('🚀 Tea-Leaves Gemma 3-4B Integration Test');
  console.log('='.repeat(50));
  console.log('');

  await testGemmaConnection();
  console.log('');
  
  await testTeaLeavesAgentPrompts();
  
  console.log('='.repeat(50));
  console.log('✨ Test completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testGemmaConnection, testTeaLeavesAgentPrompts }; 