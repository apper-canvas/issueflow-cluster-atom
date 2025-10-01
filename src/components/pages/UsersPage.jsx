import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import UserTable from '@/components/organisms/UserTable';
import UserModal from '@/components/organisms/UserModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import * as userService from '@/services/api/userService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll();
      if (response && response.success) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else {
        const errorMessage = response?.message || 'Failed to load users';
        setError(errorMessage);
        setUsers([]);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load users';
      setError(errorMessage);
      setUsers([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await userService.deleteUsers(userId);
      if (response.success) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    loadUsers();
  };

const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!searchQuery || !user) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.Name && user.Name.toLowerCase().includes(query)) ||
      (user.first_name_c && user.first_name_c.toLowerCase().includes(query)) ||
      (user.last_name_c && user.last_name_c.toLowerCase().includes(query)) ||
      (user.email_c && user.email_c.toLowerCase().includes(query))
    );
  }) : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Users</h1>
        </div>
        <Loading rows={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Users</h1>
        </div>
        <Error message={error} onRetry={loadUsers} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Users</h1>
        <Button onClick={handleCreateUser}>
          <ApperIcon name="Plus" size={16} />
          Create User
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

{!Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
        <Empty 
          message={searchQuery ? "No users found matching your search" : "No users yet"} 
          action={!searchQuery ? {
            label: "Create User",
            onClick: handleCreateUser
          } : undefined}
        />
      ) : (
        <UserTable 
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default UsersPage;