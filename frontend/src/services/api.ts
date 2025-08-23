import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tea_leaves_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tea_leaves_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Asset Tokenization API
export const assetTokenizationApi = {
  createToken: (data: any) => api.post('/asset-tokens', data),
  getTokens: () => api.get('/asset-tokens'),
  getToken: (id: string) => api.get(`/asset-tokens/${id}`),
  updateToken: (id: string, data: any) => api.put(`/asset-tokens/${id}`, data),
  deleteToken: (id: string) => api.delete(`/asset-tokens/${id}`),
  verifyToken: (id: string) => api.post(`/asset-tokens/${id}/verify`),
  getUserTokens: (userId: string) => api.get(`/users/${userId}/tokens`),
};

// Bartering API
export const barteringApi = {
  createOffer: (data: any) => api.post('/barter-offers', data),
  getOffers: () => api.get('/barter-offers'),
  getOffer: (id: string) => api.get(`/barter-offers/${id}`),
  acceptOffer: (id: string) => api.post(`/barter-offers/${id}/accept`),
  cancelOffer: (id: string) => api.post(`/barter-offers/${id}/cancel`),
  getUserOffers: (userId: string) => api.get(`/users/${userId}/offers`),
  verifyOffer: (id: string) => api.post(`/barter-offers/${id}/verify`),
};

// Liquidity Pool API
export const liquidityPoolApi = {
  createPool: (data: any) => api.post('/liquidity-pools', data),
  getPools: () => api.get('/liquidity-pools'),
  getPool: (id: string) => api.get(`/liquidity-pools/${id}`),
  addLiquidity: (id: string, data: any) => api.post(`/liquidity-pools/${id}/add-liquidity`, data),
  removeLiquidity: (id: string, data: any) => api.post(`/liquidity-pools/${id}/remove-liquidity`, data),
  executeSwap: (id: string, data: any) => api.post(`/liquidity-pools/${id}/swap`, data),
  getUserPositions: (userId: string) => api.get(`/users/${userId}/positions`),
};

// LLM API
export const llmApi = {
  generateContent: (prompt: string) => api.post('/llm/generate', { prompt }),
  analyzeToken: (tokenData: any) => api.post('/llm/analyze-token', tokenData),
  generateTokenizationInsights: (request: any) => api.post('/llm/tokenization-insights', request),
  optimizePortfolio: (portfolio: any) => api.post('/llm/optimize-portfolio', portfolio),
  getMarketAnalysis: (symbol: string) => api.post('/llm/market-analysis', { symbol }),
  getRiskAssessment: (data: any) => api.post('/llm/risk-assessment', data),
};

// Research API
export const researchApi = {
  addPaper: (data: any) => api.post('/research/papers', data),
  getPapers: () => api.get('/research/papers'),
  getPaper: (id: string) => api.get(`/research/papers/${id}`),
  updatePaper: (id: string, data: any) => api.put(`/research/papers/${id}`, data),
  deletePaper: (id: string) => api.delete(`/research/papers/${id}`),
  createCorpus: (data: any) => api.post('/research/corpus', data),
  getCorpus: (id: string) => api.get(`/research/corpus/${id}`),
  addToCorpus: (corpusId: string, paperId: string) => api.post(`/research/corpus/${corpusId}/papers`, { paperId }),
};

// User API
export const userApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

// Analytics API
export const analyticsApi = {
  getPlatformStats: () => api.get('/analytics/platform-stats'),
  getUserStats: (userId: string) => api.get(`/analytics/users/${userId}/stats`),
  getTokenStats: (tokenId: string) => api.get(`/analytics/tokens/${tokenId}/stats`),
  getBarteringStats: () => api.get('/analytics/bartering-stats'),
  getLiquidityStats: () => api.get('/analytics/liquidity-stats'),
};

export default api; 