import React, { useState } from 'react'
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouterConstant';

const ForgotPassword = ({ setScreen }) => {
  const navigate= useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot Password:', email);
  };

  const handleBackLogin = ()=>{
    setScreen("login");
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6">
      <button
        onClick={handleBackLogin}
        // className="flex items-center gap-1 text-teal-600 hover:text-teal-700 mb-4 transition group"
        className="flex mb-6 items-center gap-1 text-sm md:text-sm text-[#2fa8c8] hover:opacity-90 transition group drop-shadow-lg"
      >
        <MdArrowBackIos className="w-4 h-4" />
        <span className="font-medium text-sm md:text-base">Back to Login</span>
      </button>

      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">Reset Password</h2>
        <p className="text-gray-600 text-sm md:text-base">Enter your email and we'll send you instructions to reset your password</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm md:text-base"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#518dcd] to-[#7ac0ca] text-white py-2.5 md:py-3 rounded-xl shadow-lg font-medium text-sm md:text-base hover:opacity-90 transition"
          // className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 md:py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition shadow-lg font-medium text-sm md:text-base"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword