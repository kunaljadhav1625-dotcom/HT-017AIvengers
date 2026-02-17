import { useState, useEffect } from 'react';
import { getResults, getBlockchain, verifyBlockchain } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, Users, BookOpen } from 'lucide-react';
import AddCandidateForm from '../components/admin/AddCandidateForm';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultsPage = () => {
    const [results, setResults] = useState(null);
    const [blockchainInfo, setBlockchainInfo] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resData, chainData, verifyData] = await Promise.all([
                getResults(),
                getBlockchain(),
                verifyBlockchain()
            ]);
            setResults(resData.data);
            setBlockchainInfo(chainData.data);
            setIsValid(verifyData.data.isValid);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Election Dashboard</h1>

            {/* 1. Add Candidate Section */}
            <div className="mb-8">
                <AddCandidateForm onCandidateAdded={fetchData} />
            </div>

            {/* 2. Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-blue-100">Total Votes</p>
                            <h3 className="text-3xl font-bold">{results?.totalVotes || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-purple-100">Total Blocks</p>
                            <h3 className="text-3xl font-bold">{blockchainInfo?.length || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className={`card text-white ${isValid ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            {isValid ? <Shield className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                        </div>
                        <div>
                            <p className="text-green-100">Blockchain Status</p>
                            <h3 className="text-xl font-bold">{isValid ? 'Secure & Valid' : 'TAMPERED!'}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Charts & Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="card">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Vote Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results?.candidates}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="voteCount" fill="#4f46e5" name="Votes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Detailed Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 px-4 text-gray-600">Candidate</th>
                                    <th className="py-2 px-4 text-gray-600">Party</th>
                                    <th className="py-2 px-4 text-gray-600">State</th>
                                    <th className="py-2 px-4 text-gray-600">City</th>
                                    <th className="py-2 px-4 text-gray-600 text-right">Votes</th>
                                    <th className="py-2 px-4 text-gray-600 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results?.candidates.map((candidate, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{candidate.name}</td>
                                        <td className="py-3 px-4 text-gray-500">{candidate.party}</td>
                                        <td className="py-3 px-4 text-gray-500">{candidate.state}</td>
                                        <td className="py-3 px-4 text-gray-500">{candidate.city}</td>
                                        <td className="py-3 px-4 text-right font-bold">{candidate.voteCount}</td>
                                        <td className="py-3 px-4 text-right text-gray-500">
                                            {results.totalVotes > 0
                                                ? ((candidate.voteCount / results.totalVotes) * 100).toFixed(1)
                                                : 0}%
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
