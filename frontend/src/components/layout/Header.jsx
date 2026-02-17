import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Vote, LayoutDashboard, Blocks } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide Header on Login and Results pages (they have their own layouts)
    if (['/login', '/results'].includes(location.pathname)) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Vote className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-800">SecureVote</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    {user ? (
                        <div className="flex items-center space-x-6">
                            <Link to="/results" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
                                <LayoutDashboard className="w-4 h-4" /> Results
                            </Link>
                            <Link to="/blockchain" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
                                <Blocks className="w-4 h-4" /> Blockchain
                            </Link>

                            <div className="h-6 w-px bg-gray-200"></div>

                            <span className="text-gray-700 font-semibold">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/results" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                                <LayoutDashboard className="w-4 h-4" /> Show Results
                            </Link>
                            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform hover:scale-105">
                                Admin Login
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
