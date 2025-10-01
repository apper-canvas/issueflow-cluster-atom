const tableName = 'users_c';

/**
 * Get all users
 */
export const getAll = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "first_name_c" } },
        { field: { Name: "last_name_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ],
      orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(response.message);
      return { success: false, data: [], message: response.message };
    }

    return { success: true, data: response.data || [], total: response.total || 0 };
  } catch (error) {
    console.error("Error fetching users:", error?.response?.data?.message || error.message);
    return { success: false, data: [], message: error?.response?.data?.message || error.message };
  }
};

/**
 * Get user by ID
 */
export const getById = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "first_name_c" } },
        { field: { Name: "last_name_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, userId, params);

    if (!response?.data) {
      return { success: false, data: null, message: "User not found" };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error?.response?.data?.message || error.message);
    return { success: false, data: null, message: error?.response?.data?.message || error.message };
  }
};

/**
 * Create new user(s)
 */
export const create = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare records - only include Updateable fields
    const records = Array.isArray(userData) ? userData : [userData];
    const preparedRecords = records.map(user => {
      const record = {};
      if (user.Name) record.Name = user.Name;
      if (user.Tags) record.Tags = user.Tags;
      if (user.first_name_c) record.first_name_c = user.first_name_c;
      if (user.last_name_c) record.last_name_c = user.last_name_c;
      if (user.email_c) record.email_c = user.email_c;
      return record;
    });

    const params = { records: preparedRecords };
    const response = await apperClient.createRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      return { success: false, data: [], message: response.message };
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} user(s):`, JSON.stringify(failed));
        const errorMessages = failed.map(f => f.message || 'Unknown error').join('; ');
        return { 
          success: false, 
          data: successful.map(r => r.data), 
          message: errorMessages,
          partialSuccess: successful.length > 0
        };
      }

      return { success: true, data: successful.map(r => r.data) };
    }

    return { success: false, data: [], message: "No response data" };
  } catch (error) {
    console.error("Error creating user(s):", error?.response?.data?.message || error.message);
    return { success: false, data: [], message: error?.response?.data?.message || error.message };
  }
};

/**
 * Update existing user(s)
 */
export const update = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare records - only include Id and Updateable fields
    const records = Array.isArray(userData) ? userData : [userData];
    const preparedRecords = records.map(user => {
      const record = { Id: user.Id };
      if (user.Name !== undefined) record.Name = user.Name;
      if (user.Tags !== undefined) record.Tags = user.Tags;
      if (user.first_name_c !== undefined) record.first_name_c = user.first_name_c;
      if (user.last_name_c !== undefined) record.last_name_c = user.last_name_c;
      if (user.email_c !== undefined) record.email_c = user.email_c;
      return record;
    });

    const params = { records: preparedRecords };
    const response = await apperClient.updateRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      return { success: false, data: [], message: response.message };
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} user(s):`, JSON.stringify(failed));
        const errorMessages = failed.map(f => f.message || 'Unknown error').join('; ');
        return { 
          success: false, 
          data: successful.map(r => r.data), 
          message: errorMessages,
          partialSuccess: successful.length > 0
        };
      }

      return { success: true, data: successful.map(r => r.data) };
    }

    return { success: false, data: [], message: "No response data" };
  } catch (error) {
    console.error("Error updating user(s):", error?.response?.data?.message || error.message);
    return { success: false, data: [], message: error?.response?.data?.message || error.message };
  }
};

/**
 * Delete user(s)
 */
export const deleteUsers = async (userIds) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const params = { RecordIds: ids };

    const response = await apperClient.deleteRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      return { success: false, message: response.message };
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} user(s):`, JSON.stringify(failed));
        const errorMessages = failed.map(f => f.message || 'Unknown error').join('; ');
        return { 
          success: false, 
          message: errorMessages,
          partialSuccess: successful.length > 0
        };
      }

      return { success: true, deletedCount: successful.length };
    }

    return { success: false, message: "No response data" };
  } catch (error) {
    console.error("Error deleting user(s):", error?.response?.data?.message || error.message);
    return { success: false, message: error?.response?.data?.message || error.message };
  }
};