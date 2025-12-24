import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { ROUTES } from "../../routes/RouterConstant";
import {
  loginUser,
  loginWithGoogle,
} from "../../redux/action/authAction/AuthAction";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";
import { ROLE_VARIABLES_MAP } from "../../utils/helper";

const Login = ({ setScreen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isLoading);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });

    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleForget = () => {
    setScreen("forgot");
    navigate(ROUTES.FORGET_PASSWORD);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await dispatch(
        loginUser(formData.email, formData.password)
      );

      toast.success(`Welcome back, ${response.user.name}!`, {
        toastId: "login-success",
      });

      if (user?.role === ROLE_VARIABLES_MAP?.MEDICAL_AFFAIRS) {
        return navigate(ROUTES.MEDICAL_TOPICS);
      } else if (user?.role === ROLE_VARIABLES_MAP?.BRAND_REVIEWER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR) {
        return navigate(ROUTES.MY_TOPICS);
      } else if (user?.role === ROLE_VARIABLES_MAP?.AGENCY_POC) {
        return navigate(ROUTES.UPLOAD);
      } else if (user?.role === ROLE_VARIABLES_MAP?.CONTENT_APPROVER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.PUBLISHER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.SUPER_ADMIN) {
        return navigate(ROUTES.DASHBOARD);
      }

      // navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";

      toast.error(errorMessage, {
        toastId: "login-error",
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await dispatch(
        loginWithGoogle(credentialResponse.credential)
      );

      toast.success(`Welcome back, ${response.user.name}!`, {
        toastId: "google-success",
      });

      if (user?.role === ROLE_VARIABLES_MAP?.MEDICAL_AFFAIRS) {
        return navigate(ROUTES.MEDICAL_TOPICS);
      } else if (user?.role === ROLE_VARIABLES_MAP?.BRAND_REVIEWER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR) {
        return navigate(ROUTES.MY_TOPICS);
      } else if (user?.role === ROLE_VARIABLES_MAP?.AGENCY_POC) {
        return navigate(ROUTES.UPLOAD);
      } else if (user?.role === ROLE_VARIABLES_MAP?.CONTENT_APPROVER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.PUBLISHER) {
        return navigate(ROUTES.REVIEW_QUEUE);
      } else if (user?.role === ROLE_VARIABLES_MAP?.SUPER_ADMIN) {
        return navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";

      toast.error(errorMessage, {
        toastId: "google-error",
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.", {
      toastId: "google-error-btn",
    });
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full px-4 py-2.5 md:py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm md:text-base ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 md:py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm md:text-base ${
                validationErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500
                 hover:text-gray-700 transition disabled:opacity-50"
            >
              {showPassword ? <IoEyeOffOutline /> : <FaRegEye />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 accent-[#3d97a9] cursor-pointer"
              disabled={isLoading}
            />
            <span className="ml-2 text-xs md:text-sm text-gray-600">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={handleForget}
            className="text-sm md:text-sm text-[#2fa8c8] font-medium hover:opacity-90 transition drop-shadow-lg"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#518dcd] to-[#7ac0ca] text-white py-2.5 md:py-3 rounded-xl shadow-lg font-medium text-sm md:text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="py-4">
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full rounded-lg border border-gray-400 overflow-hidden shadow-sm">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
