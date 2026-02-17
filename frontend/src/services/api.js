import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Admin Auth
export const adminLogin = (creds) => api.post('/auth/admin-login', creds);

// Voting Flow
export const getCandidates = (city) => api.get(`/candidates?city=${city || ''}`); // Allow empty city for all
export const addCandidate = (data) => api.post('/candidates', data); // New Endpoint
export const scanBiometric = (voterId, city) => api.post('/verify-biometric', { voterId, city });
export const castVote = (candidateId, voterId) => api.post('/vote', { candidateId, voterId });

// Results APIs
export const getResults = () => api.get('/results');
export const getBlockchain = () => api.get('/blockchain');
export const verifyBlockchain = () => api.get('/blockchain/verify');
export const tamperBlockchain = () => api.post('/admin/tamper');

export default api;
