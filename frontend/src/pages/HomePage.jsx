import { useState, useEffect } from 'react';
import { getStates, getCities, getVillages } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    const [voterId, setVoterId] = useState('');
    const [loading, setLoading] = useState(false);
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
                setSelectedCity(''); // Reset dependent fields
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
        if (!selectedCity || !voterId) return;

        setLoading(true);
        try {
            // In a real app we might verify ID here, but for now we pass state to Voting Page
            // and do the verification there or let them view candidates first
            // verify city/village if needed, but primarily city is used for candidate lookup
            if (!selectedCity) return alert("Please select a city");
            navigate(`/vote?city=${selectedCity}&voterId=${voterId}`);
        } catch (error) {
            alert("Error starting session");
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
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Bharat E-Voting</h1>
                <p className="text-gray-600 mb-8">Secure • Transparent • Decentralized</p>

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
                        <input
                            type="text"
                            className="input uppercase"
                            placeholder="Ex: MUM-001"
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn bg-blue-600 text-white w-full hover:bg-blue-700 text-lg py-4 shadow-lg transform hover:-translate-y-1 transition-all"
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
