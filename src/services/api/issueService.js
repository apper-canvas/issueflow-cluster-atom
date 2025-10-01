import { toast } from "react-toastify";

class IssueService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "issue_c";
  }

  mapToDatabase(data) {
    const mapped = {};
    if (data.title !== undefined) mapped.title_c = data.title;
    if (data.description !== undefined) mapped.description_c = data.description;
    if (data.type !== undefined) mapped.type_c = data.type;
    if (data.priority !== undefined) mapped.priority_c = data.priority;
    if (data.status !== undefined) mapped.status_c = data.status;
    if (data.assignee !== undefined) mapped.assignee_c = data.assignee;
    if (data.reporter !== undefined) mapped.reporter_c = data.reporter;
    if (data.dueDate !== undefined) mapped.due_date_c = data.dueDate;
    if (data.createdAt !== undefined) mapped.created_at_c = data.createdAt;
    if (data.updatedAt !== undefined) mapped.updated_at_c = data.updatedAt;
    return mapped;
  }

  mapFromDatabase(record) {
    if (!record) return null;
    return {
      Id: record.Id,
      title: record.title_c || "",
      description: record.description_c || "",
      type: record.type_c || "bug",
      priority: record.priority_c || "medium",
      status: record.status_c || "open",
      assignee: record.assignee_c || "",
      reporter: record.reporter_c || "",
      createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString(),
      updatedAt: record.updated_at_c || record.ModifiedOn || new Date().toISOString(),
      dueDate: record.due_date_c || null
    };
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "reporter_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: getAll. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message || "Failed to fetch issues");
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error(`apper_info: An error was received in this function: getAll. The error is: ${error.message}`);
      toast.error("Failed to load issues");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "reporter_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: getById. The response body is: ${JSON.stringify(response)}.`);
        return null;
      }

      if (!response.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`apper_info: An error was received in this function: getById. The error is: ${error.message}`);
      return null;
    }
  }

  async create(issueData) {
    try {
      const now = new Date().toISOString();
      const dataWithTimestamps = {
        ...issueData,
        createdAt: now,
        updatedAt: now
      };

      const dbData = this.mapToDatabase(dataWithTimestamps);

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: create. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message || "Failed to create issue");
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0 && successful[0].data) {
          return this.mapFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error(`apper_info: An error was received in this function: create. The error is: ${error.message}`);
      toast.error("Failed to create issue");
      return null;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const dbData = this.mapToDatabase(updateData);
      dbData.Id = parseInt(id);

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: update. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message || "Failed to update issue");
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0 && successful[0].data) {
          return this.mapFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error(`apper_info: An error was received in this function: update. The error is: ${error.message}`);
      toast.error("Failed to update issue");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: delete. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message || "Failed to delete issue");
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`apper_info: An error was received in this function: delete. The error is: ${error.message}`);
      toast.error("Failed to delete issue");
      return false;
    }
  }

  async bulkUpdate(ids, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const dbData = this.mapToDatabase(updateData);

      const records = ids.map(id => ({
        ...dbData,
        Id: parseInt(id)
      }));

      const params = { records };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(`apper_info: An error was received in this function: bulkUpdate. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message || "Failed to update issues");
        return [];
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.map(r => this.mapFromDatabase(r.data));
      }

      return [];
    } catch (error) {
      console.error(`apper_info: An error was received in this function: bulkUpdate. The error is: ${error.message}`);
      toast.error("Failed to update issues");
      return [];
    }
  }
}
export default new IssueService();