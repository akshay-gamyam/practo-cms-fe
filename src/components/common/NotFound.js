import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-12">
        
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
            alt="404 Not Found Illustration"
            className="w-full max-w-xs lg:max-w-sm"
          />
        </div>

        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-7xl font-extrabold text-blue-700">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            The page you’re looking for doesn’t exist or has been moved.
            Let’s get you back on track!
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <FiArrowLeftCircle size={22} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
