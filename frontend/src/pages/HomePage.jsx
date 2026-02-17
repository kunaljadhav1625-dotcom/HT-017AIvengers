import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-12 text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Secure & Transparent E-Voting</h1>
            <p className="text-xl mb-8">Powered by Blockchain Technology</p>
            <Link to="/login" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4">
                Get Started
            </Link>
        </div>
    );
};
export default HomePage;
