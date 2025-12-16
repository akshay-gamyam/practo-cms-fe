import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomModal from "../../common/Modal/CustomModal";
import {
  updateUserRole,
  updateUserStatus,
} from "../../../redux/action/userManagementAction/UserManagementAction";
import { rolesList, statusList } from "../../../utils/helper";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";

const EditUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUser, isUpdateLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    role: "",
    status: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        role: selectedUser.role || "",
        status: selectedUser.status || "",
      });
    }
  }, [selectedUser]);

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const selectStatus = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;

    const promises = [];
    let hasChanges = false;

    if (formData.role !== selectedUser.role) {
      promises.push(dispatch(updateUserRole(selectedUser.id, formData.role)));
      hasChanges = true;
    }

    if (formData.status !== selectedUser.status) {
      promises.push(
        dispatch(updateUserStatus(selectedUser.id, formData.status))
      );
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("No changes to update");
      onClose();
      return;
    }

    try {
      await Promise.all(promises);

      toast.success("User updated successfully!", {
        autoClose: 3000,
      });

      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  if (!selectedUser) return null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Edit User">
      {isUpdateLoading ? (
        <SkeletonBlock
          title
          lines={2}
          showCard
          lineWidths={["w-full", "w-5/6"]}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-xl">
              {`${selectedUser?.firstName?.[0] || ""}${
                selectedUser?.lastName?.[0] || ""
              }`.toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </h3>
              <p className="text-gray-500 text-sm">{selectedUser?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {rolesList.map((role) => {
                const isActive = formData.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => selectRole(role.value)}
                    disabled={isUpdateLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {statusList.map((status) => {
                const isActive = formData.status === status.value;
                const colorClasses = {
                  green: isActive
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
                  gray: isActive
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                  red: isActive
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
                };

                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => selectStatus(status.value)}
                    disabled={isUpdateLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      colorClasses[status.color]
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              disabled={isUpdateLoading}
              className="px-5 py-2 rounded-lg border hover:border-gray-400 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdateLoading}
              className="px-5 py-2 border hover:shadow-xl hover:border-teal-600 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdateLoading ? "Updating..." : "Update User"}
            </button>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default EditUserModal;
