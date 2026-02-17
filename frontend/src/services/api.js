import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Voting APIs
export const getCandidates = () => api.get('/candidates');
export const castVote = (candidateId) => api.post('/vote', { candidateId });

// Results APIs
export const getResults = () => api.get('/results');
export const getVoterStatus = (voterId) => api.get(`/voter-status/${voterId}`);

// Blockchain APIs
export const getBlockchain = () => api.get('/blockchain');
export const verifyBlockchain = () => api.get('/blockchain/verify');
export const getBlock = (index) => api.get(`/blockchain/block/${index}`);

// Admin/Demo APIs
export const tamperBlockchain = () => api.post('/admin/tamper');

export default api;
