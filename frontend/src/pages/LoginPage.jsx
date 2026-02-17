import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../services/api';
import { Lock, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

const LoginPage = () => {
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
            setError(err.response?.data?.error || 'Access Denied: Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30">

            {/* 1. Animated Background Mesh */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
            </div>

            {/* 2. Login Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Header Branding */}
                <div className="text-center mb-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-cyan-900/20 mb-4 group ring-1 ring-white/5 mx-auto">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png"
                            className="w-10 h-10 invert opacity-90 group-hover:scale-110 transition-transform duration-500"
                            alt="Emblem"
                        />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">Admin Portal</h1>
                    <div className="flex items-center justify-center gap-2 text-cyan-400/80 text-xs font-bold uppercase tracking-[0.2em]">
                        <ShieldCheck className="w-3 h-3" />
                        Secure Access
                    </div>
                </div>

                {/* Glassmorphism Form Container */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden group">

                    {/* Subtle Border Gradient Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                            <div className="bg-red-500/20 p-1.5 rounded-lg shrink-0">
                                <Lock className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-red-400 font-bold text-sm">Authentication Failed</h4>
                                <p className="text-red-400/80 text-xs mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* Username Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Administrator ID</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all hover:bg-slate-950/80"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Secure Password</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all hover:bg-slate-950/80"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="text-sm">Verifying Credential...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm">Access Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Back Link */}
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Public Portal
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
