import { useState, useEffect } from 'react';
import { getStates, getCities, getVillages, addCandidate } from '../../services/api';
import { Upload, X, Check } from 'lucide-react';

const AddCandidateForm = ({ onSuccess }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);

    const [form, setForm] = useState({
        name: '',
        party: '',
        state: '',
        city: '',
        village: '',
        image: null // Changed to handle File object
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getStates().then(res => setStates(res.data));
    }, []);

    useEffect(() => {
        if (form.state) {
            getCities(form.state).then(res => setCities(res.data));
        } else {
            setCities([]);
        }
    }, [form.state]);

    useEffect(() => {
        if (form.city) {
            getVillages(form.city).then(res => setVillages(res.data));
        } else {
            setVillages([]);
        }
    }, [form.city]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Use FormData for File Upload
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('party', form.party);
            formData.append('state', form.state);
            formData.append('city', form.city);
            if (form.village) formData.append('village', form.village);
            if (form.image) formData.append('image', form.image);

            await addCandidate(formData); // API handles Multipart
            alert("Candidate Added Successfully!");

            // Reset
            setForm({ name: '', party: '', state: '', city: '', village: '', image: null });
            setPreview(null);
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Add Candidate Error:", error);
            alert("Failed to add candidate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-inner border border-blue-100">
            <h3 className="font-bold text-lg mb-4 text-blue-800">New Candidate Registration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        className="input w-full"
                        placeholder="Candidate Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                {/* 2. Party */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Party Name</label>
                    <input
                        type="text"
                        required
                        className="input w-full"
                        placeholder="Political Party"
                        value={form.party}
                        onChange={e => setForm({ ...form, party: e.target.value })}
                    />
                </div>

                {/* 3. State */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                    <select
                        className="input w-full"
                        required
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value, city: '', village: '' })}
                    >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* 4. City */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City / Constituency</label>
                    <select
                        className="input w-full"
                        required
                        disabled={!form.state}
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value, village: '' })}
                    >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* 5. Village */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Village (Optional)</label>
                    <select
                        className="input w-full"
                        disabled={!form.city}
                        value={form.village}
                        onChange={e => setForm({ ...form, village: e.target.value })}
                    >
                        <option value="">Select Village</option>
                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                {/* 6. Image Upload */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Candidate Photo</label>
                    <div className="flex items-center gap-4">
                        {/* Preview */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-400 w-6 h-6" />
                            )}
                            {preview && (
                                <button
                                    type="button"
                                    onClick={() => { setForm({ ...form, image: null }); setPreview(null); }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full m-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2 font-medium">Use the button above to browse files from your Computer (Downloads, Desktop, etc)</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn bg-blue-600 text-white px-6 py-2 rounded shadow-md flex items-center gap-2"
                >
                    {loading ? <span className="animate-spin">⏳</span> : <Check className="w-4 h-4" />}
                    {loading ? 'Registering...' : 'Register Candidate'}
                </button>
            </div>
        </form>
    );
};

export default AddCandidateForm;
