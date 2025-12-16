import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomModal from "../../common/Modal/CustomModal";
import { createUser } from "../../../redux/action/userManagementAction/UserManagementAction";
import { rolesList } from "../../../utils/helper";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isCreateLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));


    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const selectRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    if (validationErrors.role) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.role;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.role) {
      errors.role = "Please select a role";
    }

    return errors;
  };

  const handleSubmit = async () => {
    setValidationErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(createUser(formData));

      toast.success("User created successfully!", {
        autoClose: 3000,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
      });
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create user";
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
    setValidationErrors({});
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} title="Add New User">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isCreateLoading}
            />
            {validationErrors.firstName && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isCreateLoading}
            />
            {validationErrors.lastName && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="user@practo.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isCreateLoading}
          />
          {validationErrors.email && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              validationErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isCreateLoading}
          />
          {validationErrors.password && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Role <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {rolesList.map((role) => {
              const isActive = formData.role === role.value;

              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => selectRole(role.value)}
                  disabled={isCreateLoading}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          {validationErrors.role && (
            <p className="text-xs text-red-500 mt-2">{validationErrors.role}</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            You can select only one role
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={handleClose}
            disabled={isCreateLoading}
            className="px-5 py-2 rounded-lg border hover:border-gray-400 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreateLoading}
            className="px-5 py-2 border hover:shadow-xl hover:border-teal-600 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreateLoading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddUserModal;