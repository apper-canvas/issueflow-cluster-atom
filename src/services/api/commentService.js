import { toast } from 'react-toastify';

class CommentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'comment_c';
  }

  mapFromDatabase(record) {
    if (!record) return null;
    return {
      Id: record.Id,
      issueId: record.issue_id_c?.Id || record.issue_id_c,
      content: record.content_c || "",
      createdBy: record.created_by_c || null,
      createdOn: record.created_on_c || record.CreatedOn || new Date().toISOString(),
      modifiedBy: record.modified_by_c || null,
      modifiedOn: record.modified_on_c || record.ModifiedOn || new Date().toISOString()
    };
  }

  mapToDatabase(data) {
    const payload = {};
    
    if (data.issueId !== undefined) {
      payload.issue_id_c = typeof data.issueId === 'object' ? data.issueId.Id : parseInt(data.issueId);
    }
    if (data.content !== undefined && data.content !== '') {
      payload.content_c = data.content;
    }
    if (data.createdBy !== undefined) {
      payload.created_by_c = typeof data.createdBy === 'object' ? data.createdBy.Id : parseInt(data.createdBy);
    }
    if (data.createdOn !== undefined && data.createdOn !== '') {
      payload.created_on_c = data.createdOn;
    }
    if (data.modifiedBy !== undefined) {
      payload.modified_by_c = typeof data.modifiedBy === 'object' ? data.modifiedBy.Id : parseInt(data.modifiedBy);
    }
    if (data.modifiedOn !== undefined && data.modifiedOn !== '') {
      payload.modified_on_c = data.modifiedOn;
    }

    return payload;
  }

  async getByIssueId(issueId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "issue_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_on_c" } },
          { field: { Name: "modified_by_c" } },
          { field: { Name: "modified_on_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "issue_id_c",
            Operator: "EqualTo",
            Values: [parseInt(issueId)]
          }
        ],
        orderBy: [{ fieldName: "created_on_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(commentData) {
    try {
      const payload = this.mapToDatabase(commentData);
      
      const params = {
        records: [payload]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create comment:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success('Comment added successfully');
          return this.mapFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      toast.error('Failed to add comment');
      return null;
    }
  }

  async update(id, updates) {
    try {
      const payload = {
        Id: parseInt(id),
        ...this.mapToDatabase(updates)
      };

      const params = {
        records: [payload]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update comment:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success('Comment updated successfully');
          return this.mapFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      toast.error('Failed to update comment');
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
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete comment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success('Comment deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      toast.error('Failed to delete comment');
      return false;
    }
  }
}

export default new CommentService();