import { useState, useEffect, useRef } from 'react';
import { getStates, getCities, getVillages, addCandidate } from '../../services/api';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

const AddCandidateForm = ({ onSuccess }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [villages, setVillages] = useState([]);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        party: '',
        state: '',
        city: '',
        village: '',
        image: null
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getStates().then(res => setStates(res.data)).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (form.state) {
            getCities(form.state).then(res => setCities(res.data)).catch(console.error);
        } else {
            setCities([]);
        }
    }, [form.state]);

    useEffect(() => {
        if (form.city) {
            getVillages(form.city).then(res => setVillages(res.data)).catch(console.error);
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
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('party', form.party);
            formData.append('state', form.state);
            formData.append('city', form.city);
            if (form.village) formData.append('village', form.village);
            if (form.image) formData.append('image', form.image);

            await addCandidate(formData);
            alert("Candidate Added Successfully!");

            setForm({ name: '', party: '', state: '', city: '', village: '', image: null });
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Add Candidate Error:", error);
            alert("Failed to add candidate.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder:text-slate-600 transition-all";
    const labelClasses = "block text-xs font-bold text-cyan-200 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                    <Check className="w-4 h-4 text-cyan-400" />
                </div>
                New Candidate Registration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Name */}
                <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="e.g. Rajesh Kumar"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                {/* 2. Party */}
                <div>
                    <label className={labelClasses}>Party Name</label>
                    <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="e.g. Janta Party"
                        value={form.party}
                        onChange={e => setForm({ ...form, party: e.target.value })}
                    />
                </div>

                {/* 3. State */}
                <div>
                    <label className={labelClasses}>State</label>
                    <select
                        className={inputClasses}
                        required
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value, city: '', village: '' })}
                    >
                        <option value="" className="text-slate-500">Select State</option>
                        {states.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                    </select>
                </div>

                {/* 4. City */}
                <div>
                    <label className={labelClasses}>City / Constituency</label>
                    <select
                        className={inputClasses}
                        required
                        disabled={!form.state}
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value, village: '' })}
                    >
                        <option value="" className="text-slate-500">Select City</option>
                        {cities.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                    </select>
                </div>

                {/* 5. Village */}
                <div>
                    <label className={labelClasses}>Village (Optional)</label>
                    <select
                        className={inputClasses}
                        disabled={!form.city}
                        value={form.village}
                        onChange={e => setForm({ ...form, village: e.target.value })}
                    >
                        <option value="" className="text-slate-500">Select Village</option>
                        {villages.map(v => <option key={v} value={v} className="bg-slate-800">{v}</option>)}
                    </select>
                </div>

                {/* 6. Image Upload */}
                <div className="md:col-span-2 bg-slate-900/50 rounded-xl p-4 border border-white/5 border-dashed hover:border-cyan-500/50 transition-colors">
                    <label className={labelClasses}>Candidate Photo</label>
                    <div className="flex items-center gap-6 mt-2">
                        {/* Preview */}
                        <div className="w-24 h-24 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group shrink-0">
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setForm({ ...form, image: null }); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </>
                            ) : (
                                <ImageIcon className="text-slate-600 w-8 h-8" />
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-full file:border-0
                                file:text-xs file:font-bold file:uppercase file:tracking-wider
                                file:bg-cyan-500 file:text-slate-900
                                hover:file:bg-cyan-400 cursor-pointer
                                focus:outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                Upload a clear portrait (JPG/PNG, Max 5MB).
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <span className="animate-spin text-xl mr-2">⟳</span> : <Check className="w-5 h-5" />}
                    {loading ? 'Registering...' : 'Register Candidate'}
                </button>
            </div>
        </form>
    );
};

export default AddCandidateForm;
