import { useState, useEffect } from 'react';
import { getBlockchain, verifyBlockchain, tamperBlockchain } from '../services/api';
import { Shield, AlertTriangle, Skull } from 'lucide-react';

const BlockchainPage = () => {
    const [blockchain, setBlockchain] = useState(null);
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlockchain();
    }, []);

    const fetchBlockchain = async () => {
        try {
            const response = await getBlockchain();
            setBlockchain(response.data);
        } catch (error) {
            console.error('Failed to fetch blockchain:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            const response = await verifyBlockchain();
            setVerification(response.data);
        } catch (error) {
            console.error('Failed to verify blockchain:', error);
        }
    };

    const handleTamper = async () => {
        if (!window.confirm("WARNING: This will corrupt the blockchain data to demonstrate security. Are you sure?")) return;

        try {
            await tamperBlockchain();
            alert("Attack simulation successful! Blockchain data has been altered.");
            // Refresh checks
            handleVerify();
            fetchBlockchain();
        } catch (error) {
            alert("Tamper failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Blockchain Explorer</h1>

            <div className="card max-w-6xl mx-auto mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Blockchain Status</h2>
                        <p className="text-gray-600">Total Blocks: {blockchain?.length}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleTamper} className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                            <Skull className="w-5 h-5" />
                            Simulate Attack
                        </button>
                        <button onClick={handleVerify} className="btn btn-primary flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Verify Integrity
                        </button>
                    </div>
                </div>

                {verification && (
                    <div className={`p-4 rounded-lg flex items-center space-x-3 ${verification.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {verification.isValid ? (
                            <Shield className="w-6 h-6" />
                        ) : (
                            <AlertTriangle className="w-6 h-6" />
                        )}
                        <span className="font-semibold">{verification.message}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4 max-w-6xl mx-auto">
                {blockchain?.chain.map((block, index) => (
                    <div key={index} className="card">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Block #{block.index}</p>
                                <p className="text-sm text-gray-600">
                                    Timestamp: {new Date(block.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">
                                    Previous Hash: <code className="text-xs">{block.previousHash.substring(0, 16)}...</code>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Hash: <code className="text-xs">{block.hash.substring(0, 16)}...</code>
                                </p>
                            </div>
                        </div>

                        {block.data.type !== 'genesis' && (
                            <div className="mt-4 bg-gray-100 p-4 rounded">
                                <p><strong>Candidate:</strong> {block.data.candidateName}</p>
                                {block.data.tampered && (
                                    <p className="text-red-600 font-bold">⚠️ TAMPERED DATA DETECTED</p>
                                )}
                                <p className="text-sm text-gray-600">Vote Time: {block.data.timestamp}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainPage;
