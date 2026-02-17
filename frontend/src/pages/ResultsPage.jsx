import { useState, useEffect } from 'react';
import { getResults, deleteCandidate, addCandidate } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Blocks, BadgeCheck, Trash2, Edit, PlusCircle, LayoutDashboard, LogOut, TrendingUp, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddCandidateForm from '../components/admin/AddCandidateForm';

const ResultsPage = () => {
    const [stats, setStats] = useState({ totalVotes: 0, leadingCandidate: null });
    const [candidates, setCandidates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await getResults();
            setStats(res.data.stats);
            setCandidates(res.data.candidates);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000); // Fast Live refresh for Demo
        return () => clearInterval(interval);
    }, []);

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

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

    // Filter Logic
    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Prepare Chart Data (Top 5)
    const chartData = candidates.slice(0, 5).map(c => ({
        name: c.name.split(' ')[0], // First name for chart
        votes: c.voteCount,
        fill: COLORS[candidates.indexOf(c) % COLORS.length]
    }));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-white text-blue-900 border-b p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png" className="w-8 h-8" alt="Logo" />
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight leading-none">GENERAL ELECTION 2026</h1>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Live Results • MLA Posts</p>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full transition-all text-sm font-semibold">
                    <LogOut className="w-4 h-4" /> Exit
                </button>
            </nav>

            <div className="flex-1 container mx-auto p-4 md:p-8 space-y-8">

                {/* 1. TOP STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Winner Card */}
                    <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <img
                                src={stats.leadingCandidate?.image || 'https://via.placeholder.com/100'}
                                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
                                alt="Winner"
                            />
                            <div>
                                <p className="text-blue-100 font-bold tracking-widest text-xs uppercase mb-1">Current Leader</p>
                                <h2 className="text-3xl font-extrabold">{stats.leadingCandidate?.name || 'Waiting for Votes...'}</h2>
                                <p className="text-blue-200 mt-1 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    {stats.leadingCandidate?.party} • {stats.leadingCandidate?.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Votes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Votes Cast</p>
                            <h2 className="text-4xl font-extrabold text-gray-800 mt-2">{stats.totalVotes}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-green-500 text-sm font-bold mt-4">
                            <TrendingUp className="w-4 h-4" /> +12% vs Last Hour
                        </div>
                    </div>

                    {/* Blockchain Status */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Blockchain Status</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <h2 className="text-xl font-bold text-gray-800">SECURE</h2>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-4 break-all">
                            Blocks Synced: 100%
                        </div>
                    </div>
                </div>

                {/* 2. CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" /> Vote Distribution (Top 5)
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="votes" radius={[10, 10, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donut Chart / Party Share */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6">Vote Share %</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            {stats.totalVotes > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={candidates}
                                            dataKey="voteCount"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {candidates.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-400">No votes yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. DETAILED TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Detailed Results by Constituency</h2>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Filter by City or Name..."
                                className="input py-2 text-sm w-64 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="btn bg-blue-600 text-white text-xs px-4"
                            >
                                {showForm ? 'Close Admin' : 'Manage Candidates'}
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <div className="p-6 bg-blue-50/30 border-b">
                            <AddCandidateForm onSuccess={() => { fetchData(); setShowForm(false); }} />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="p-5">Candidate</th>
                                    <th className="p-5">Constituency</th>
                                    <th className="p-5 text-right">Votes</th>
                                    <th className="p-5 w-1/3">Performance</th>
                                    <th className="p-5 text-center">Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCandidates.map((candidate, idx) => (
                                    <tr key={candidate.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-5 flex items-center gap-4">
                                            <span className="text-gray-300 font-bold text-lg w-6">#{idx + 1}</span>
                                            <img src={candidate.image || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                                            <div>
                                                <p className="font-bold text-gray-800">{candidate.name}</p>
                                                <p className="text-xs text-gray-500 font-semibold">{candidate.party}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                                {candidate.city}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <p className="font-bold text-xl text-gray-800">{candidate.voteCount}</p>
                                            <p className="text-xs text-gray-400">votes</p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${candidate.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold w-10 text-right">{candidate.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(candidate.id)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
