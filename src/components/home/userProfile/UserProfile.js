import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEdit, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../../../redux/action/authAction/AuthAction";
import { passwordFields } from "../../../utils/helper";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, passwordChange, passwordChangeLoading, passwordChangeError } = useSelector((state) => state.auth);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentpassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (passwordChange) {
      setPasswordData({
        currentpassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditingPassword(false);
      setErrors({});
    }
  }, [passwordChange]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentpassword) {
      newErrors.currentpassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentpassword === passwordData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      await dispatch(
        changePassword({
          currentpassword: passwordData.currentpassword,
          newPassword: passwordData.newPassword,
        })
      );
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPassword(false);
    setPasswordData({
      currentpassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };

  const renderPasswordInput = (field, label, name, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[field] ? "text" : "password"}
          name={name}
          value={passwordData[name]}
          onChange={handlePasswordChange}
          disabled={passwordChangeLoading}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  const profileFields = [
    { label: "First Name", value: user?.firstName },
    { label: "Last Name", value: user?.lastName },
    { label: "Email", value: user?.email },
    {
      label: "Role",
      value: user?.role
        ?.split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" "),
    },
  ];

  const optionalFields = [
    { label: "Specialty", value: user?.specialty, condition: user?.specialty },
    { label: "City", value: user?.city, condition: user?.city },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your account information and security
          </p>
        </div>

        {passwordChange && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            Password changed successfully!
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Information
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Your personal details and account information
              </p>
            </div>
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {getUserInitials()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileFields.map((field) => (
              <div key={field.label}>
                <label className="text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <p className="mt-1 text-gray-900 font-medium">
                  {field.value || "N/A"}
                </p>
              </div>
            ))}

            {optionalFields.map(
              (field) =>
                field.condition && (
                  <div key={field.label}>
                    <label className="text-sm font-medium text-gray-500">
                      {field.label}
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {field.value}
                    </p>
                  </div>
                )
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user?.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user?.status || "N/A"}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Account Created
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {formatDate(user?.createdAt)}
              </p>
            </div>

            {user?.lastLoginAt && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Last Login
                </label>
                <p className="mt-1 text-gray-900 font-medium">
                  {formatDate(user.lastLoginAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Security Settings
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage your password and account security
              </p>
            </div>
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
                Change Password
              </button>
            )}
          </div>

          {!isEditingPassword ? (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Password
              </label>
              <p className="mt-1 text-gray-900 font-medium">••••••••••</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {passwordChangeError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {passwordChangeError}
                </div>
              )}

             {passwordFields.map((field) => renderPasswordInput(field))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={passwordChangeLoading}
                  className="px-6 py-2 hover:shadow-xl rounded-xl border border-gray-400 hover:border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="px-6 py-2 border hover:shadow-xl hover:border-teal-600 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordChangeLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
