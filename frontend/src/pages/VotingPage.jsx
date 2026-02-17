import { useState, useEffect } from 'react';
import { getCandidates, castVote } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await getCandidates();
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    };

    const handleVote = async () => {
        if (!selectedCandidate) return;

        setLoading(true);
        try {
            const response = await castVote(selectedCandidate);
            setSuccess(response.data);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to cast vote');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="card max-w-2xl mx-auto text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Vote Recorded Successfully!</h2>
                    <div className="bg-gray-100 p-6 rounded-lg space-y-2">
                        <p><strong>Candidate:</strong> {success.candidate}</p>
                        <p><strong>Block Hash:</strong> <code className="text-sm">{success.blockHash}</code></p>
                        <p><strong>Block Number:</strong> {success.blockIndex}</p>
                    </div>
                    <p className="mt-4 text-gray-600">
                        Your vote has been permanently recorded on the blockchain.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Cast Your Vote</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className={`card cursor-pointer transition-all ${selectedCandidate === candidate.id
                                ? 'ring-4 ring-primary scale-105'
                                : 'hover:shadow-xl'
                            }`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                    >
                        <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-32 h-32 mx-auto rounded-full mb-4"
                        />
                        <h3 className="text-xl font-bold text-center">{candidate.name}</h3>
                        <p className="text-gray-600 text-center">{candidate.party}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={handleVote}
                    disabled={!selectedCandidate || loading}
                    className="btn btn-primary text-lg px-12"
                >
                    {loading ? 'Submitting Vote...' : 'Submit Vote'}
                </button>
            </div>
        </div>
    );
};

export default VotingPage;
