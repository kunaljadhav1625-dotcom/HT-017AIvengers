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
export const addCandidate = (data) => {
    // Check if data is FormData (for file upload)
    if (data instanceof FormData) {
        return api.post('/candidates', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return api.post('/candidates', data);
};
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const checkVoterStatus = (voterId) => api.get(`/status/${voterId}`); // New Status Check
export const scanBiometric = (voterId, city, image) => api.post('/verify-biometric', { voterId, city, image });
export const castVote = (candidateId, voterId) => api.post('/vote', { candidateId, voterId });

// Location APIs
export const getStates = () => api.get('/locations/states');
export const getCities = (state) => api.get(`/locations/cities?state=${state}`);
export const getVillages = (city) => api.get(`/locations/villages?city=${city}`);

// Results APIs
export const getResults = () => api.get('/results/summary');
export const getBlockchain = () => api.get('/blockchain');
export const verifyBlockchain = () => api.get('/blockchain/verify');
export const tamperBlockchain = () => api.post('/admin/tamper');

export default api;
