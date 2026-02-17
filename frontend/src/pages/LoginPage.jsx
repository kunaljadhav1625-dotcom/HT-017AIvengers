import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../services/api'; // Use adminLogin instead of login
import { Lock, User } from 'lucide-react';

const LoginPage = () => {
  // Use admin auth flow
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(formData);
      // Assuming response gives token & user info
      loginUser({ name: 'Admin', role: 'admin' }, response.data.token);
      navigate('/results'); // Admins go to results
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="card max-w-md w-full border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h2>
        <p className="text-center text-gray-500 mb-6">Restricted Access Only</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="input pl-10"
                placeholder="Ex: admin"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                className="input pl-10"
                placeholder="Ex: admin123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-gray-800 text-white w-full hover:bg-gray-900"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
             <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:underline">
                 ← Back to Voter Home
             </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
