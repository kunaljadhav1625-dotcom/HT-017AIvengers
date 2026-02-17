import { useState } from 'react';
import { addCandidate } from '../../services/api';
import { PlusCircle } from 'lucide-react';

const AddCandidateForm = ({ onCandidateAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        party: '',
        city: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const cities = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await addCandidate(formData);
            setMessage('Candidate added successfully!');
            setFormData({ name: '', party: '', city: '', image: '' });
            if (onCandidateAdded) onCandidateAdded();
        } catch (error) {
            setMessage('Failed to add candidate.');
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select
                        className="input"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
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
