const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>

                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                {/* Inner dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            </div>

            <p className="mt-6 text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
