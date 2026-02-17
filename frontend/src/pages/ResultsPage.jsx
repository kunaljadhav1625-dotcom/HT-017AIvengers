import { useState, useEffect } from 'react';
import { getResults } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsPage = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await getResults();
            setResults(response.data);
        } catch (error) {
            console.error('Failed to fetch results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Election Results</h1>

            <div className="card max-w-6xl mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">{results?.totalVotes}</div>
                        <div className="text-gray-600">Total Votes</div>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">{results?.candidates.length}</div>
                        <div className="text-gray-600">Candidates</div>
                    </div>
                    <div className="bg-purple-100 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {results?.blockchainValid ? '✓ Valid' : '✗ Invalid'}
                        </div>
                        <div className="text-gray-600">Blockchain Status</div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Vote Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={results?.candidates}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Detailed Results</h2>
                    <div className="space-y-4">
                        {results?.candidates.map((candidate, index) => (
                            <div key={candidate.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                                    <div>
                                        <div className="font-bold">{candidate.name}</div>
                                        <div className="text-sm text-gray-600">{candidate.party}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{candidate.votes}</div>
                                    <div className="text-sm text-gray-600">{candidate.percentage}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
