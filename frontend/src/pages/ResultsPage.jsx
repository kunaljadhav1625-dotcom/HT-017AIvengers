import { useState, useEffect } from 'react';
import axios from 'axios';
import { getResults, deleteCandidate } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trash2, LogOut, TrendingUp, Award, MapPin, Users, Activity, Crown, Search, Filter, ShieldCheck, Zap, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddCandidateForm from '../components/admin/AddCandidateForm';

const ResultsPage = () => {
    const [stats, setStats] = useState({ totalVotes: 0, leadingCandidate: null });
    const [candidates, setCandidates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('All');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/results/summary?city=${selectedCity}`);
            setStats(res.data.stats);
            setCandidates(res.data.candidates);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Cities Once
    useEffect(() => {
        axios.get('http://localhost:5000/api/results/cities')
            .then(res => setCities(['All', ...res.data]))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000); // Live refresh
        return () => clearInterval(interval);
    }, [selectedCity]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await deleteCandidate(id);
                fetchData();
            } catch (err) {
                alert("Failed to delete candidate");
            }
        }
    };

    const handleReset = async () => {
        if (window.confirm("⚠️ DANGER ZONE: This will RESET the entire election.\\n\\nALL VOTES and BLOCKCHAIN HISTORY will be deleted.\\n\\nDo you want to proceed for a fresh demo?")) {
            try {
                await axios.post('http://localhost:5000/api/vote/reset');
                alert("Election Reset Successfully! You can now start a fresh demo.");
                fetchData();
            } catch (err) {
                console.error(err);
                alert("Failed to reset election.");
            }
        }
    };

    // Neon & Vibrant Colors for Dark Mode
    const COLORS = ['#38bdf8', '#4ade80', '#facc15', '#f87171', '#a78bfa', '#fb7185'];

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chartData = candidates.slice(0, 5).map(c => ({
        name: c.name.split(' ')[0],
        votes: c.voteCount,
        fill: COLORS[candidates.indexOf(c) % COLORS.length]
    }));

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans text-slate-100 selection:bg-cyan-500/30">
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Futuristic Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20">
                <div className="container mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png" className="w-10 h-10 relative z-10 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" alt="Logo" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">BHARAT E-VOTE</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase">Live Election Dashboard</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-4 items-center'>
                        {user?.role === 'admin' && (
                            <button
                                onClick={handleReset}
                                className="bg-red-500 hover:bg-red-600 text-white border border-red-400 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                                title="Delete All Data & Reset Election"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">RESET DEMO</span>
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/blockchain')}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span className="hidden md:inline">Blockchain</span>
                        </button>
                        {/* Glowing City Filter */}
                        {/* Glowing City Filter - Always Visible */}
                        <div className="flex items-center bg-slate-900/80 border border-white/10 rounded-full p-1 pl-4 shadow-lg shadow-blue-500/5 group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-wider mr-2">
                                <Filter className="w-3.5 h-3.5" /> Zone:
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="appearance-none bg-slate-800 font-bold text-white text-sm pl-4 pr-10 py-1.5 rounded-full border border-white/5 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city} className="bg-slate-900">
                                            {city === 'All' ? '🇮🇳 National View' : `📍 ${city}`}
                                        </option>
                                    ))}
                                </select>
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400 pointer-events-none" />
                            </div>
                        </div>

                        {user && (
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Log Out</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex-1 container mx-auto p-4 md:p-8 space-y-8 relative z-10">

                {/* 1. HERO STATS GRID - Dark Mode */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Winner Card */}
                    <div className="md:col-span-8 lg:col-span-6 bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-1 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]"></div>

                        <div className="h-full bg-[#0f172a]/40 backdrop-blur-md rounded-[22px] p-8 flex flex-col justify-between relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold tracking-wider uppercase mb-3 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                        <Crown className="w-3.5 h-3.5" />
                                        {selectedCity === 'All' ? 'National Lead' : `${selectedCity} Leader`}
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-2 text-white drop-shadow-lg">
                                        {stats.leadingCandidate?.name || 'Waiting...'}
                                    </h2>
                                    <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                        <Award className="w-4 h-4 text-indigo-400" />
                                        {stats.leadingCandidate?.party} • {stats.leadingCandidate?.city}
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                                    <img
                                        src={stats.leadingCandidate?.image || 'https://via.placeholder.com/100'}
                                        className="w-24 h-24 rounded-full border-2 border-indigo-400/50 shadow-2xl object-cover relative z-10"
                                        alt="Winner"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-amber-950 text-xs font-black px-2 py-0.5 rounded shadow-lg border border-amber-400 z-20">
                                        #1
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-baseline gap-1">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-t from-indigo-200 via-white to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    {stats.leadingCandidate?.percentage || '0'}
                                </span>
                                <span className="text-2xl font-bold text-indigo-300">%</span>
                                <span className="text-sm font-semibold text-slate-400 ml-2 uppercase tracking-wide">of total votes</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-6">
                        {/* Total Votes */}
                        <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all"></div>

                            <div className="p-3 bg-cyan-500/10 w-fit rounded-xl mb-4 text-cyan-400 border border-cyan-500/20">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-5xl font-black text-white tracking-tight">{stats.totalVotes}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Votes Cast</p>

                            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 text-xs font-bold text-cyan-300 animate-pulse">
                                <Zap className="w-3.5 h-3.5 fill-current" /> Live
                            </div>
                        </div>
                    </div>

                    {/* Blockchain Status */}
                    <div className="md:col-span-12 lg:col-span-3 space-y-6">
                        <div className="h-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 box-shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-500/10 w-fit rounded-xl text-emerald-400 border border-emerald-500/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Secured</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">Blockchain</h3>
                                <p className="text-emerald-400/80 font-medium text-sm mt-1">Mining Difficulty: 2</p>
                            </div>
                            <div className="mt-4">
                                <div className="text-xs font-mono text-slate-500 mb-1">Latest Hash (PoW Verified):</div>
                                <div className="text-[10px] font-mono bg-black/40 p-2.5 rounded-lg border border-white/5 text-emerald-500/80 break-all leading-tight shadow-inner font-bold">
                                    0000a7252c239f57be42361165...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ANALYTICS & CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Bar Chart */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    Vote Distribution
                                </h3>
                                <p className="text-sm text-slate-400 font-medium mt-1">Top 5 Candidates Performance Metrics</p>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            {candidates.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} barSize={50}>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            dy={15}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="votes" radius={[12, 12, 12, 12]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} strokeWidth={2} stroke="transparent" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 font-medium">No Data Available</div>
                            )}
                        </div>
                    </div>

                    {/* Vote Share Donut */}
                    <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-8">Market Share</h3>
                        <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                            {stats.totalVotes > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-4xl font-black text-white">{stats.totalVotes}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Total</span>
                                </div>
                            )}

                            {stats.totalVotes > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={candidates}
                                            dataKey="voteCount"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={85}
                                            outerRadius={110}
                                            paddingAngle={4}
                                            cornerRadius={8}
                                            stroke="none"
                                        >
                                            {candidates.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-slate-500 font-medium">Waiting for votes...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. MANAGEMENT TABLE */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Candidate Roster</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Manage & Monitor {filteredCandidates.length} Active Candidates</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search database..."
                                    className="pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all w-72 placeholder:text-slate-600"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                                >
                                    {showForm ? <Trash2 className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                                    {showForm ? 'Close' : 'Add New'}
                                </button>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <div className="p-8 bg-indigo-900/10 border-b border-white/5 animate-in fade-in slide-in-from-top-4">
                            <AddCandidateForm onSuccess={() => { fetchData(); setShowForm(false); }} />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate Profile</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Zone</th>
                                    <th className="p-6 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Live Votes</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest w-1/3">Trend</th>
                                    {user?.role === 'admin' && <th className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCandidates.map((candidate, idx) => (
                                    <tr key={candidate.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-5">
                                                <span className={`font-black text-xl w-8 text-right ${idx < 3 ? 'text-amber-400' : 'text-slate-600'}`}>#{idx + 1}</span>
                                                <div className="relative">
                                                    <img
                                                        src={candidate.image || 'https://via.placeholder.com/40'}
                                                        className="w-14 h-14 rounded-2xl object-cover shadow-lg bg-slate-800 ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all"
                                                        alt=""
                                                    />
                                                    {idx === 0 && (
                                                        <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-lg shadow-amber-500/20">
                                                            <Crown className="w-3 h-3 text-amber-900" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">{candidate.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase border border-white/5">{candidate.party}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-400 font-medium">
                                                <MapPin className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                                {candidate.city}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <p className="font-black text-2xl text-white tracking-tight">{candidate.voteCount}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 bg-black/40 rounded-full h-2.5 overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full relative"
                                                        style={{ width: `${candidate.percentage}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 w-12 text-right">{candidate.percentage}%</span>
                                            </div>
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="p-6 text-center">
                                                <button
                                                    onClick={() => handleDelete(candidate.id)}
                                                    className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete Candidate"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CSS Animation for Shimmer */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default ResultsPage;
