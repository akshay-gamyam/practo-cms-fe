import React from "react";
import CustomModal from "../../common/Modal/CustomModal";
import { useSelector } from "react-redux";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";

const ViewUserModal = ({ isOpen, onClose }) => {
  const { selectedUser, isViewLoading } = useSelector((state) => state.user);

  if (!selectedUser && !isViewLoading) return null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="User Profile">
      {isViewLoading ? (
        <SkeletonBlock
          title
          lines={2}
          showCard
          lineWidths={["w-full", "w-5/6"]}
        />
      ) : (
        <div className="space-y-6 space-x-2">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-2xl">
              {`${selectedUser?.firstName?.[0] || ""}${
                selectedUser?.lastName?.[0] || ""
              }`.toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </h3>
              <p className="text-gray-500">{selectedUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                First Name
              </label>
              <p className="text-gray-900 font-medium">
                {selectedUser?.firstName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Name
              </label>
              <p className="text-gray-900 font-medium">
                {selectedUser?.lastName}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <p className="text-gray-900 font-medium">{selectedUser?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Role
              </label>
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                {selectedUser?.role}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser?.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : selectedUser?.status === "INACTIVE"
                    ? "bg-gray-100 text-gray-700 border border-gray-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {selectedUser?.status}
              </span>
            </div>

            {selectedUser?.specialty && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Specialty
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedUser?.specialty}
                </p>
              </div>
            )}

            {selectedUser?.city && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  City
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedUser?.city}
                </p>
              </div>
            )}

            {selectedUser?.contentCount !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Content Count
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedUser?.contentCount}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-gray-900 font-medium">
                {selectedUser?.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {selectedUser?.lastLoginAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Login
                </label>
                <p className="text-gray-900 font-medium">
                  {new Date(selectedUser.lastLoginAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default ViewUserModal;
