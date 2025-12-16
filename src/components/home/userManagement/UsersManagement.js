import React, { useCallback, useEffect, useState } from "react";
import UserCard from "../../common/userCard/UserCard";
import { CiSearch } from "react-icons/ci";
import { IoShieldOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  fetchUserManagementList,
} from "../../../redux/action/userManagementAction/UserManagementAction";
import AddUserModal from "./AddUserModal";
import { FiUserPlus } from "react-icons/fi";
import { clearSelectedUser } from "../../../redux/reducer/userManagementReducer/UserManagementReducer";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";

const UserManagement = () => {
  const dispatch = useDispatch();

  const { users, isListLoading, error } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserManagementList());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleCloseAddModal = useCallback(() => {
    setIsAddUserOpen(false);
    dispatch(fetchUserManagementList());
  }, [dispatch]);

  const handleViewProfile = async (userId) => {
    try {
      setShowViewUserModal(true);
      await dispatch(fetchUserById(userId));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleEditUser = async (userId) => {
    try {
      setShowEditUserModal(true);
      await dispatch(fetchUserById(userId));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleCloseViewModal = useCallback(() => {
    setShowViewUserModal(false);
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const handleCloseEditModal = useCallback(() => {
    setShowEditUserModal(false);
    dispatch(clearSelectedUser());
    dispatch(fetchUserManagementList());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              User Management
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Manage team members and their roles
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white font-medium shadow-md hover:opacity-90 transition-all duration-200"
          >
            {/* <LiaUserPlusSolid size={20} /> */}
            <FiUserPlus size={20} />
            Add User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <CiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-teal-500 hover:text-white border border-gray-300 rounded-xl text-gray-700 font-medium transition-colors whitespace-nowrap">
              <IoShieldOutline size={20} />
              Role Permissions
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isListLoading && <SkeletonBlock />}

        {!isListLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onViewProfile={handleViewProfile}
                onEditUser={handleEditUser}
              />
            ))}
          </div>
        )}

        {!isListLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No users found matching your search."
                : "No users found."}
            </p>
          </div>
        )}
      </div>

      <AddUserModal isOpen={isAddUserOpen} onClose={handleCloseAddModal} />
      <ViewUserModal
        isOpen={showViewUserModal}
        onClose={handleCloseViewModal}
      />
      <EditUserModal
        isOpen={showEditUserModal}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default UserManagement;
