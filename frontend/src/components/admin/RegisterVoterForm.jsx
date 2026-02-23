import { useState, useEffect, useRef } from 'react';
import { Camera, User, MapPin, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { registerVoter, getStates, getCities, getVillages } from '../../services/api';

const RegisterVoterForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        state: '',
        city: '',
        village: ''
    });

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [error, setError] = useState('');

    // Camera States
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Load States
    useEffect(() => {
        getStates().then(res => setStates(res.data)).catch(console.error);
    }, []);

    // Load Cities when State changes
    useEffect(() => {
        if (formData.state) {
            getCities(formData.state).then(res => setCities(res.data)).catch(console.error);
            setFormData(prev => ({ ...prev, city: '', village: '' }));
        }
    }, [formData.state]);

    // Load Villages when City changes
    useEffect(() => {
        if (formData.city) {
            getVillages(formData.city).then(res => setVillages(res.data)).catch(console.error);
            setFormData(prev => ({ ...prev, village: '' }));
        }
    }, [formData.city]);

    const startCamera = async () => {
        setIsCameraOpen(true);
        setError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError("Camera Access Denied: " + err.message);
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stopCamera();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!capturedImage) {
            setError("Please capture the voter's face photo.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await registerVoter({
                ...formData,
                image: capturedImage
            });
            setSuccessData(response.data);
            if (onSuccess) {
                setTimeout(() => {
                    // We don't call onSuccess immediately because we want to show the Voter ID
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="bg-slate-900/60 p-8 rounded-2xl border border-emerald-500/30 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
                <p className="text-slate-400 mb-6 font-medium">New voter has been added to the government database.</p>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Name</span>
                            <span className="text-lg font-bold text-white">{successData.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assigned Voter ID</span>
                            <span className="text-2xl font-black text-cyan-400 font-mono tracking-tighter">{successData.voterId}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSuccessData(null);
                        setFormData({ name: '', state: '', city: '', village: '' });
                        setCapturedImage(null);
                        if (onSuccess) onSuccess();
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                    Register Another Voter
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <User className="w-6 h-6 text-blue-400" />
                </div>
                Voter Registration Portal
            </h3>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 animate-shake">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="Enter Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">State</label>
                            <select
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                required
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">City</label>
                            <select
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none disabled:opacity-50"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                disabled={!formData.state}
                                required
                            >
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Village / Ward (Optional)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <select
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none disabled:opacity-50"
                                value={formData.village}
                                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                disabled={!formData.city}
                            >
                                <option value="">Select Village</option>
                                {villages.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !capturedImage}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Complete Registration
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Facial Capture */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Verification (Face Capture)</label>
                    <div className="relative aspect-square md:aspect-auto md:h-[350px] bg-black rounded-3xl border-2 border-white/5 overflow-hidden group shadow-2xl">
                        {isCameraOpen ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-64 h-80 border-2 border-dashed border-cyan-400/50 rounded-full opacity-50"></div>
                                </div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all"
                                    >
                                        <Camera className="w-6 h-6" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="bg-red-500 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-red-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : capturedImage ? (
                            <div className="relative h-full">
                                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                                <div className="absolute inset-0 bg-blue-600/10"></div>
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" /> Retake Photo
                                </button>
                                <div className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    Captured
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center bg-slate-900">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20">
                                    <Camera className="w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Face Identification Required</p>
                                    <p className="text-slate-500 text-xs mt-1">Biometric data will be securely stored in the government encrypted vault.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20"
                                >
                                    Start Camera
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
        </div>
    );
};

export default RegisterVoterForm;
