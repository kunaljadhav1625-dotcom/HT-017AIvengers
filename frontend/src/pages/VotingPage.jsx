import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCandidates, scanBiometric, castVote, checkVoterStatus } from '../services/api';
import { Fingerprint, ScanFace, CheckCircle, Camera, Clock, BadgeCheck, XCircle } from 'lucide-react';

// Biometric Modal Component
const BiometricModal = ({ isOpen, onClose, onVerified, storedPhoto }) => {
    const [step, setStep] = useState('idle'); // idle, camera_init, scanning, verifying, success
    const [failMessage, setFailMessage] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStep('idle');
            setCapturedImage(null);
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, step]);

    const startCamera = async () => {
        setStep('camera_init');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            setStream(mediaStream);
            setStep('scanning');
        } catch (err) {
            alert("Camera Error: " + err.message);
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
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            verifyImage(imageData);
        }
    };

    const verifyImage = async (img) => {
        setStep('verifying');
        setFailMessage('');

        // Minimum visual delay for "Analysis" feel
        await new Promise(r => setTimeout(r, 2000));

        try {
            await onVerified(img); // Wait for backend check
            setStep('success');
            setTimeout(() => {
                onClose(); // Close after showing success
            }, 2000);
        } catch (err) {
            console.error(err);
            setFailMessage(err.response?.data?.error || "Verification Failed");
            setStep('failed');
            // Allow retry after delay
            setTimeout(() => {
                setStep('scanning');
                setCapturedImage(null);
                setFailMessage('');
                startCamera();
            }, 4000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* 1. INITIALIZING */}
                {step === 'camera_init' && (
                    <div className="py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
                        <p className="text-gray-600 font-semibold">Accessing Camera...</p>
                    </div>
                )}

                {/* 2. SCANNING */}
                {step === 'scanning' && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ScanFace className="w-6 h-6 text-blue-600" />
                            Face Verification
                        </h3>
                        <div className="relative mb-6 rounded-xl overflow-hidden border-4 border-blue-500 shadow-xl bg-black w-[320px] h-[240px]">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                            <div className="absolute inset-0 border-2 border-white/40 rounded-full w-40 h-52 m-auto shadow-[0_0_100px_rgba(0,0,0,0.5)_inset]"></div>
                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-400 opacity-50 animate-[scan_2s_linear_infinite]"></div>
                        </div>
                        <button onClick={handleCapture} className="btn bg-blue-600 text-white w-full py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                            <Camera className="w-5 h-5" /> Capture & Verify
                        </button>
                    </div>
                )}

                {/* 3. VERIFYING (COMPARISON UI) */}
                {step === 'verifying' && (
                    <div className="py-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Analyzing Facial Features...</h3>

                        <div className="flex justify-center items-center gap-4 mb-8">
                            {/* Stored Photo */}
                            <div className="relative">
                                <p className="text-xs text-gray-500 mb-1 font-bold">STORED ID</p>
                                <img src={storedPhoto || 'https://via.placeholder.com/150'} alt="Stored" className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover" />
                            </div>

                            {/* Animation */}
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-1 bg-gray-200 rounded overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]"></div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono animate-pulse mt-2">Comparing Vectors...</span>
                            </div>

                            {/* Captured Photo */}
                            <div className="relative">
                                <p className="text-xs text-gray-500 mb-1 font-bold">LIVE CAPTURE</p>
                                <img src={capturedImage} alt="Captured" className="w-24 h-24 rounded-full border-4 border-blue-300 object-cover" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. SUCCESS */}
                {step === 'success' && (
                    <div className="py-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-600">Identity Verified!</h3>
                        <p className="text-gray-500">Access Granted.</p>
                    </div>
                )}

                {/* 5. FAILED */}
                {step === 'failed' && (
                    <div className="py-10">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-600">Verification Failed</h3>
                        <p className="text-gray-700 mt-2 font-medium px-4">{failMessage || "Face does not match records."}</p>
                        <p className="text-xs text-gray-400 mt-4">Retrying camera in 4s...</p>
                    </div>
                )}

                <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
            </div>
        </div>
    );
};

// Main Page
const VotingPage = () => {
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city');
    const voterId = searchParams.get('voterId');
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [voterData, setVoterData] = useState(null); // Store fetched voter details
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [voteSuccess, setVoteSuccess] = useState(null);
    const [timeLeft, setTimeLeft] = useState(180);

    // Initial Load & Verification
    useEffect(() => {
        if (!city || !voterId) {
            navigate('/');
            return;
        }

        const initPage = async () => {
            try {
                // 1. Fetch Voter Details (Photo, Status)
                const statusRes = await checkVoterStatus(voterId);
                if (statusRes.data.hasVoted) {
                    alert("You have already voted!");
                    navigate('/');
                    return;
                }
                setVoterData(statusRes.data);

                // 2. Fetch Candidates
                const candRes = await getCandidates(city);
                setCandidates(candRes.data);
            } catch (error) {
                console.error("Error loading page:", error);
                alert("Error loading election data.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        initPage();
    }, [city, voterId]);

    // Timer Logic
    useEffect(() => {
        if (!voteSuccess) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [voteSuccess]);

    const handleBiometricSuccess = async (img) => {
        // setVerifying(false); // Internal modal handles close
        await scanBiometric(voterId, city, img);
        // If successful, cast vote immediately
        const response = await castVote(selectedCandidate, voterId);
        setVoteSuccess(response.data);
    };

    if (voteSuccess) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="card max-w-xl w-full text-center border-t-4 border-green-500 shadow-xl p-8">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Vote Recorded!</h2>
                    <p className="text-gray-600 mb-6">Your vote for <strong>{voteSuccess.candidate}</strong> is secured.</p>
                    <div className="bg-gray-100 p-4 rounded text-left font-mono text-xs mb-6 break-all">
                        BLOCK HASH: {voteSuccess.blockHash}
                    </div>
                    <button onClick={() => navigate('/')} className="btn bg-blue-600 text-white w-full">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Voter Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                        {voterData?.photoUrl && (
                            <div className="relative">
                                <img src={voterData.photoUrl} alt="Voter" className="w-16 h-16 rounded-full border-4 border-blue-50 shadow-md object-cover" />
                                <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">General Election 2026</p>
                            <h1 className="text-2xl font-extrabold text-gray-800">Hello, {voterData?.name || 'Voter'}</h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Voting for <span className="text-gray-800 font-bold">MLA</span> in <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{city}</span> Constituency
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Time Remaining</p>
                        <div className="font-mono text-3xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg tracking-wider tabular-nums">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
                        {candidates.map(candidate => (
                            <div
                                key={candidate.id}
                                onClick={() => setSelectedCandidate(candidate.id)}
                                className={`bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedCandidate === candidate.id ? 'border-blue-600 shadow-xl scale-[1.02]' : 'border-transparent hover:shadow-md'
                                    }`}
                            >
                                <img src={candidate.image || 'https://via.placeholder.com/300'} alt={candidate.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{candidate.name}</h3>
                                    <p className="text-gray-500">{candidate.party}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                    <div className="container mx-auto flex justify-between items-center">
                        <p className="text-gray-600">
                            {selectedCandidate ? 'Candidate Selected' : 'Select a candidate to vote'}
                        </p>
                        <button
                            onClick={() => setVerifying(true)}
                            disabled={!selectedCandidate}
                            className="btn bg-blue-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
                        >
                            {selectedCandidate ? 'Proceed to Verification' : 'Select Candidate'}
                        </button>
                    </div>
                </div>

                <BiometricModal
                    isOpen={verifying}
                    onClose={() => setVerifying(false)}
                    onVerified={handleBiometricSuccess}
                    storedPhoto={voterData?.photoUrl} // Pass stored photo
                />
            </div>
        </div>
    );
};

export default VotingPage;
