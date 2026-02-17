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
export const getCandidates = (city) => api.get(`/candidates?city=${city}`);
export const scanBiometric = (voterId, city) => api.post('/verify-biometric', { voterId, city });
export const castVote = (candidateId, voterId) => api.post('/vote', { candidateId, voterId }); // Updated to send voterId

// Location APIs
export const getStates = () => api.get('/locations/states');
export const getCities = (state) => api.get(`/locations/cities?state=${state}`);
export const getVillages = (city) => api.get(`/locations/villages?city=${city}`);

// Results APIs
export const getResults = () => api.get('/results');
export const getBlockchain = () => api.get('/blockchain');
export const verifyBlockchain = () => api.get('/blockchain/verify');
export const tamperBlockchain = () => api.post('/admin/tamper');

export default api;
