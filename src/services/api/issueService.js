import issuesData from "@/services/mockData/issues.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class IssueService {
  constructor() {
    this.issues = [...issuesData];
  }

  async getAll() {
    await delay(300);
    return [...this.issues];
  }

  async getById(id) {
    await delay(200);
    const issue = this.issues.find(i => i.Id === parseInt(id));
    return issue ? { ...issue } : null;
  }

  async create(issueData) {
    await delay(400);
    const maxId = Math.max(...this.issues.map(i => i.Id), 0);
    const newIssue = {
...issueData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: issueData.dueDate || null
    };
    this.issues.push(newIssue);
    return { ...newIssue };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.issues.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
this.issues[index] = {
        ...this.issues[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        dueDate: updates.dueDate !== undefined ? updates.dueDate : this.issues[index].dueDate
      };
      return { ...this.issues[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(300);
    const index = this.issues.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      this.issues.splice(index, 1);
      return true;
    }
    return false;
  }

  async bulkUpdate(ids, updates) {
    await delay(450);
    const updatedIssues = [];
    ids.forEach(id => {
      const index = this.issues.findIndex(i => i.Id === parseInt(id));
      if (index !== -1) {
        this.issues[index] = {
          ...this.issues[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updatedIssues.push({ ...this.issues[index] });
      }
    });
    return updatedIssues;
  }
}

export default new IssueService();