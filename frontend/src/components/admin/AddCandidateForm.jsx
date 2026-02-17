import { useState, useEffect } from 'react';
import { addCandidate, getStates, getCities, getVillages } from '../../services/api';
import { PlusCircle } from 'lucide-react';

const AddCandidateForm = ({ onCandidateAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        party: '',
        state: '',
        city: '',
        village: '',
        image: ''
    });

    // Dropdown Data
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Load States
    useEffect(() => {
        getStates().then(res => setStates(res.data)).catch(console.error);
    }, []);

    // Load Cities
    useEffect(() => {
        if (formData.state) {
            getCities(formData.state).then(res => setCities(res.data)).catch(console.error);
            setFormData(prev => ({ ...prev, city: '', village: '' }));
        } else {
            setCities([]);
        }
    }, [formData.state]);

    // Load Villages
    useEffect(() => {
        if (formData.city) {
            getVillages(formData.city).then(res => setVillages(res.data)).catch(console.error);
            setFormData(prev => ({ ...prev, village: '' }));
        } else {
            setVillages([]);
        }
    }, [formData.city]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.state || !formData.city) {
            setMessage('State and City are required.');
            return;
        }

        try {
            await addCandidate(formData);
            setMessage('Candidate added successfully!');
            // Reset Form (Resetting all fields for a fresh entry)
            setFormData({ name: '', party: '', state: '', city: '', village: '', image: '' });
            if (onCandidateAdded) onCandidateAdded();
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to add candidate.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card my-6 border border-gray-200 shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Add New Candidate
            </h3>

            {message && (
                <div className={`p-2 mb-4 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        className="input"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Party</label>
                    <input
                        type="text"
                        className="input"
                        value={formData.party}
                        onChange={e => setFormData({ ...formData, party: e.target.value })}
                        required
                    />
                </div>

                {/* State Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select
                        className="input"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        required
                    >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* City Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select
                        className="input"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        required
                        disabled={!formData.state}
                    >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Village Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Village/Area (Optional)</label>
                    <select
                        className="input"
                        value={formData.village}
                        onChange={e => setFormData({ ...formData, village: e.target.value })}
                        disabled={!formData.city || villages.length === 0}
                    >
                        <option value="">Select Village</option>
                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="btn bg-blue-600 text-white w-full hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Candidate'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCandidateForm;
