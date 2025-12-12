import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/RouterConstant";

const Login = ({ setScreen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChange = () => {
    setScreen("signup");
    navigate(ROUTES.SIGNUP);
  };

  const handleForget = () => {
    setScreen("forgot");
    navigate(ROUTES.FORGET_PASSWORD);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Sign in to continue to your account
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm md:text-base"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 accent-[#3d97a9] cursor-pointer"
              // className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 cursor-pointer"
            />
            <span className="ml-2 text-xs md:text-sm text-gray-600">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={handleForget}
            // className="text-xs md:text-sm text-teal-600 hover:text-teal-700 font-medium transition"
            // className="text-xs md:text-sm text-[#3d97a9] hover:text-[#4fa7bb] font-medium transition"
            className="text-sm md:text-sm text-[#2fa8c8] font-medium hover:opacity-90 transition drop-shadow-lg"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#518dcd] to-[#7ac0ca] text-white py-2.5 md:py-3 rounded-xl shadow-lg font-medium text-sm md:text-base hover:opacity-90 transition"
          // className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 md:py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition shadow-lg font-medium text-sm md:text-base"
        >
          Log In
        </button>
      </div>

      <div className="mt-5 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?
          <button
            onClick={handleChange}
            className="ml-1 text-[#2fa8c8] font-medium hover:opacity-90 transition drop-shadow-lg"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
