import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import IssuesPage from "@/components/pages/IssuesPage";
import BoardPage from "@/components/pages/BoardPage";
import DashboardPage from "@/components/pages/DashboardPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateIssue = () => {
    setCreateModalOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-secondary-50">
        <Header
          onCreateIssue={handleCreateIssue}
          onSearch={handleSearch}
        />
        <Routes>
          <Route
            path="/"
            element={
              <IssuesPage
                searchQuery={searchQuery}
                onCreateIssue={handleCreateIssue}
                createModalOpen={createModalOpen}
                onCreateModalClose={() => setCreateModalOpen(false)}
              />
            }
          />
          <Route
            path="/board"
            element={<BoardPage onCreateIssue={handleCreateIssue} />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;