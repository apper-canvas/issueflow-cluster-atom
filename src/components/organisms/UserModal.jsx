import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import * as userService from '@/services/api/userService';

const UserModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    Name: '',
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    Tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || '',
        first_name_c: user.first_name_c || '',
        last_name_c: user.last_name_c || '',
        email_c: user.email_c || '',
        Tags: user.Tags || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name?.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.email_c?.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data - only include fields with values
      const submitData = {};
      if (formData.Name?.trim()) submitData.Name = formData.Name.trim();
      if (formData.first_name_c?.trim()) submitData.first_name_c = formData.first_name_c.trim();
      if (formData.last_name_c?.trim()) submitData.last_name_c = formData.last_name_c.trim();
      if (formData.email_c?.trim()) submitData.email_c = formData.email_c.trim();
      if (formData.Tags?.trim()) submitData.Tags = formData.Tags.trim();

      let response;
      if (user) {
        // Update existing user
        submitData.Id = user.Id;
        response = await userService.update(submitData);
      } else {
        // Create new user
        response = await userService.create(submitData);
      }

      if (response.success) {
        toast.success(user ? 'User updated successfully' : 'User created successfully');
        onSuccess();
      } else {
        toast.error(response.message || (user ? 'Failed to update user' : 'Failed to create user'));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">
                {user ? 'Edit User' : 'Create User'}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  error={errors.Name}
                />
                {errors.Name && (
                  <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  First Name
                </label>
                <Input
                  name="first_name_c"
                  value={formData.first_name_c}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Last Name
                </label>
                <Input
                  name="last_name_c"
                  value={formData.last_name_c}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email_c"
                  value={formData.email_c}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  error={errors.email_c}
                />
                {errors.email_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.email_c}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tags
                </label>
                <Input
                  name="Tags"
                  value={formData.Tags}
                  onChange={handleChange}
                  placeholder="Enter tags (comma-separated)"
                />
                <p className="mt-1 text-xs text-secondary-500">
                  Separate multiple tags with commas
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
<Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      <span className="ml-2">{user ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>{user ? 'Update User' : 'Create User'}</>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default UserModal;