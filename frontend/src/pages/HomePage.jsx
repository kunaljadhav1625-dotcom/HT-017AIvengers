import { useState, useEffect } from 'react';
import { getStates, getCities, getVillages, checkVoterStatus } from '../services/api'; // Ensure checkVoterStatus is imported
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const HomePage = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    const [voterId, setVoterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // New Error State

    const navigate = useNavigate();

    // Load States on Mount
    useEffect(() => {
        getStates().then(res => setStates(res.data)).catch(err => console.error(err));
    }, []);

    // Load Cities when State changes
    useEffect(() => {
        if (selectedState) {
            getCities(selectedState).then(res => {
                setCities(res.data);
                setSelectedCity('');
                setVillages([]);
                setSelectedVillage('');
            }).catch(err => console.error(err));
        } else {
            setCities([]);
            setVillages([]);
        }
    }, [selectedState]);

    // Load Villages when City changes
    useEffect(() => {
        if (selectedCity) {
            getVillages(selectedCity).then(res => {
                setVillages(res.data);
                setSelectedVillage('');
            }).catch(err => console.error(err));
        } else {
            setVillages([]);
        }
    }, [selectedCity]);

    const handleStart = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!selectedCity || !voterId) {
            setError("Please select all fields and enter Voter ID.");
            return;
        }

        setLoading(true);
        try {
            // STEP 1: Check if Voter Exists & Has Voted
            const statusRes = await checkVoterStatus(voterId);
            const { exists, hasVoted, city } = statusRes.data;

            if (!exists) {
                setError("❌ Invalid Voter ID. Not found in database.");
                setLoading(false);
                return;
            }

            if (hasVoted) {
                setError("⚠️ ACCESS DENIED: You have ALREADY voted.");
                setLoading(false);
                return;
            }

            // STEP 2: Proceed if Eligible
            navigate(`/vote?city=${selectedCity}&voterId=${voterId}`);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setError("❌ Invalid Voter ID. Please check and try again.");
            } else {
                setError("⚠️ Server Error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-white to-green-400 p-4">
            <div className="card max-w-lg w-full text-center shadow-2xl border-2 border-gray-200">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png"
                    alt="Indian Emblem"
                    className="w-24 h-24 mx-auto mb-4"
                />
                <div className="mb-6">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">GENERAL ELECTION 2026</h1>
                    <div className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full inline-block mt-2 tracking-widest border border-orange-200">
                        POST: MEMBER OF LEGISLATIVE ASSEMBLY (MLA)
                    </div>
                </div>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Secure, Transparent & Decentralized Voting System for the Modern Democracy of India.
                </p>

                <form onSubmit={handleStart} className="space-y-6 text-left">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select Your State</label>
                        <select
                            className="input"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            required
                        >
                            <option value="">-- Choose State --</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select Your City</label>
                        <select
                            className="input"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            required
                            disabled={!selectedState}
                        >
                            <option value="">-- Choose City --</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select Your Village / Area</label>
                        <select
                            className="input"
                            value={selectedVillage}
                            onChange={(e) => setSelectedVillage(e.target.value)}
                            disabled={!selectedCity || villages.length === 0}
                        >
                            <option value="">-- Choose Village (Optional) --</option>
                            {villages.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Enter Voter ID Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`input uppercase pr-10 ${error ? 'border-red-500 focus:ring-red-200' : ''}`}
                                placeholder="Ex: PUN-001"
                                value={voterId}
                                onChange={(e) => {
                                    setVoterId(e.target.value);
                                    setError(''); // Clear error on type
                                }}
                                required
                            />
                            {loading && (
                                <div className="absolute right-3 top-3">
                                    <Loader className="w-5 h-5 animate-spin text-blue-500" />
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-bold animate-pulse">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {!error && (
                            <p className="text-xs text-gray-500 mt-1">Note: One Vote Per ID. Strict Enforcement.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`btn w-full text-lg py-4 shadow-lg transform transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'}`}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Proceed to Vote ➔'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Admin Access Only</p>
                    <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline text-sm">
                        Login to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
export default HomePage;
