import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCandidates, scanBiometric, castVote } from '../services/api'; // Need to update api.js
import { Fingerprint, ScanFace, CheckCircle, AlertOctagon } from 'lucide-react';

const BiometricModal = ({ isOpen, onClose, onVerified }) => {
    const [step, setStep] = useState('idle'); // idle, scanning, success, error

    useEffect(() => {
        if (isOpen && step === 'idle') {
            startScan();
        }
    }, [isOpen]);

    const startScan = () => {
        setStep('scanning');
        // Simulate 3 seconds of scanning
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onVerified();
            }, 1000);
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                {step === 'scanning' && (
                    <div className="flex flex-col items-center animate-pulse">
                        <ScanFace className="w-24 h-24 text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Verifying Identity...</h3>
                        <p className="text-gray-500">Please look at the camera</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div className="bg-blue-500 h-2 rounded-full animate-[width_3s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}
                {step === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-24 h-24 text-green-500 mb-4 scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-green-600">Verified!</h3>
                        <p className="text-gray-500">Redirecting...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const VotingPage = () => {
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city');
    const voterId = searchParams.get('voterId');
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [voteSuccess, setVoteSuccess] = useState(null);

    useEffect(() => {
        if (!city || !voterId) {
            navigate('/');
            return;
        }
        fetchCandidates();
    }, [city]);

    const fetchCandidates = async () => {
        try {
            const response = await getCandidates(city); // Pass city
            setCandidates(response.data);
        } catch (error) {
            alert("Failed to load candidates for " + city);
        } finally {
            setLoading(false);
        }
    };

    const handleCandidateSelect = (id) => {
        setSelectedCandidate(id);
    };

    const initiateVote = () => {
        setVerifying(true);
    };

    const handleBiometricSuccess = async () => {
        setVerifying(false);
        try {
            // First check if valid on server (simulated)
            await scanBiometric(voterId, city);

            // Then cast vote
            const response = await castVote(selectedCandidate, voterId);
            setVoteSuccess(response.data);
        } catch (error) {
            alert(error.response?.data?.error || "Verification Failed");
        }
    };

    if (voteSuccess) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="card max-w-2xl w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Vote Cast Successfully!</h2>
                    <p className="text-gray-600 mb-6">Your vote for <strong>{voteSuccess.candidate}</strong> has been secured on the blockchain.</p>

                    <div className="bg-gray-100 p-4 rounded-lg text-left text-sm font-mono mb-6 overflow-x-auto">
                        <p>Block Index: {voteSuccess.blockIndex}</p>
                        <p>Block Hash: {voteSuccess.blockHash}</p>
                    </div>

                    <button onClick={() => navigate('/')} className="btn btn-primary w-full">
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Candidates for {city}</h1>
                    <p className="text-white/80">Voter ID: {voterId}</p>
                </div>
                <button onClick={() => navigate('/')} className="text-white hover:underline">Cancel</button>
            </div>

            {loading ? (
                <div className="text-white text-center">Loading Candidates...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map(candidate => (
                        <div
                            key={candidate.id}
                            onClick={() => handleCandidateSelect(candidate.id)}
                            className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl transform hover:-translate-y-1 ${selectedCandidate === candidate.id ? 'ring-4 ring-green-500 scale-105' : ''
                                }`}
                        >
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                <img src={candidate.image || 'https://via.placeholder.com/400'} alt={candidate.name} className="w-full h-full object-cover" />
                                {selectedCandidate === candidate.id && (
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                                <p className="text-gray-600 font-medium">{candidate.party}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Selected Candidate</p>
                        <p className="font-bold text-lg">
                            {selectedCandidate ? candidates.find(c => c.id === selectedCandidate)?.name : 'None'}
                        </p>
                    </div>
                    <button
                        onClick={initiateVote}
                        disabled={!selectedCandidate}
                        className="btn bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Fingerprint className="w-5 h-5" />
                        Verify & Vote
                    </button>
                </div>
            </div>

            <BiometricModal
                isOpen={verifying}
                onClose={() => setVerifying(false)}
                onVerified={handleBiometricSuccess}
            />
        </div>
    );
};

export default VotingPage;
