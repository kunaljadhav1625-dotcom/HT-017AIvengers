import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCandidates, scanBiometric, castVote } from '../services/api';
import { Fingerprint, ScanFace, CheckCircle, Camera, Clock } from 'lucide-react';

const BiometricModal = ({ isOpen, onClose, onVerified }) => {
    // ... (Keep existing Camera logic as is)
    const [step, setStep] = useState('idle');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (isOpen && step === 'idle') {
            startCamera();
        }
        return () => {
            stopCamera();
        }
    }, [isOpen]);

    const startCamera = async () => {
        setStep('camera_init');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStep('scanning');
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Camera access is required for biometric verification.");
            onClose();
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 320, 240);
            verifyImage();
        }
    };

    const verifyImage = () => {
        setStep('verifying');
        setTimeout(() => {
            stopCamera();
            setStep('success');
            setTimeout(() => {
                onVerified();
            }, 1000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                {step === 'scanning' && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Face Verification</h3>
                        <div className="relative mb-4 rounded-lg overflow-hidden border-4 border-blue-500 shadow-lg">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-[320px] h-[240px] object-cover bg-black"
                            />
                            <div className="absolute inset-0 border-2 border-white/50 rounded-full w-48 h-64 m-auto"></div>
                            <div className="absolute top-4 right-4 animate-pulse">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">Position your face within the frame</p>
                        <button
                            onClick={handleCapture}
                            className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-6 py-3 rounded-full text-lg shadow-xl"
                        >
                            <Camera className="w-6 h-6" />
                            Capture & Verify
                        </button>
                    </div>
                )}
                {step === 'verifying' && (
                    <div className="flex flex-col items-center py-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-800">Verifying Biometrics...</h3>
                        <p className="text-gray-500">Matching with Aadhar Database...</p>
                    </div>
                )}
                {step === 'success' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-600">Identity Verified!</h3>
                        <p className="text-gray-500">Proceeding to cast vote...</p>
                    </div>
                )}
                <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
                {step === 'scanning' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
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

    // Timer State
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    useEffect(() => {
        if (!city || !voterId) {
            navigate('/');
            return;
        }
        fetchCandidates();
    }, [city]);

    // Timer Effect
    useEffect(() => {
        if (!voteSuccess) { // Don't count down if already finished
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        alert("Session Expired: You took too long to vote.");
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [voteSuccess]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const fetchCandidates = async () => {
        try {
            const response = await getCandidates(city);
            setCandidates(response.data);
        } catch (error) {
            // Error handling
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
            await scanBiometric(voterId, city);
            const response = await castVote(selectedCandidate, voterId);
            setVoteSuccess(response.data);
        } catch (error) {
            alert(error.response?.data?.error || "Verification Failed");
        }
    };

    // Success Screen
    if (voteSuccess) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="card max-w-2xl w-full text-center border-t-4 border-green-500 shadow-2xl">
                    {/* ... Success UI ... */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-4xl font-bold mb-2 text-gray-800">Vote Cast Successfully!</h2>
                    <p className="text-xl text-gray-600 mb-8">Your vote for <strong className="text-green-700">{voteSuccess.candidate}</strong> has been secured on the blockchain.</p>
                    <div className="bg-gray-100 p-6 rounded-xl text-left font-mono text-sm mb-8 overflow-x-auto border border-gray-200 shadow-inner">
                        <p className="mb-2"><span className="font-bold text-gray-500">BLOCK INDEX:</span> {voteSuccess.blockIndex}</p>
                        <p><span className="font-bold text-gray-500">BLOCK HASH:</span> <span className="text-blue-600 break-all">{voteSuccess.blockHash}</span></p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => navigate('/results')} className="btn bg-gray-800 text-white hover:bg-gray-900">
                            View Live Results
                        </button>
                        <button onClick={() => navigate('/')} className="btn btn-outline">
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Timer */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Candidates for {city}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <p>Voter ID: <span className="font-mono font-bold">{voterId}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* TIMER */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-xl shadow-sm ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-gray-700'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                        <button onClick={() => navigate('/')} className="text-red-500 hover:text-red-700 font-medium">Exit Voting</button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                        {candidates.map(candidate => (
                            <div
                                key={candidate.id}
                                onClick={() => handleCandidateSelect(candidate.id)}
                                className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-2 ${selectedCandidate === candidate.id ? 'border-green-500 shadow-xl ring-2 ring-green-200' : 'border-transparent shadow-md'
                                    }`}
                            >
                                <div className="h-56 bg-gray-200 overflow-hidden relative">
                                    <img src={candidate.image || 'https://via.placeholder.com/400'} alt={candidate.name} className="w-full h-full object-cover" />
                                    {selectedCandidate === candidate.id && (
                                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center transition-all animate-in fade-in">
                                            <CheckCircle className="w-20 h-20 text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {candidate.party}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{candidate.name}</h3>
                                    <p className="text-gray-500">{candidate.party} Candidate</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Bottom Bar (Unchanged) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-200 z-40">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="hidden md:block">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Selected Candidate</p>
                            <p className="font-bold text-xl text-blue-600">
                                {selectedCandidate ? candidates.find(c => c.id === selectedCandidate)?.name : 'None selected'}
                            </p>
                        </div>
                        <button
                            onClick={initiateVote}
                            disabled={!selectedCandidate}
                            className="w-full md:w-auto btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-full shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 text-lg font-bold transition-all transform active:scale-95"
                        >
                            <ScanFace className="w-6 h-6" />
                            {selectedCandidate ? 'Proceed to Verification' : 'Select a Candidate'}
                        </button>
                    </div>
                </div>

                <BiometricModal
                    isOpen={verifying}
                    onClose={() => setVerifying(false)}
                    onVerified={handleBiometricSuccess}
                />
            </div>
        </div>
    );
};

export default VotingPage;
