import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onCreateIssue, onSearch }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navItems = [
    { path: "/", label: "Issues", icon: "List" },
    { path: "/board", label: "Board", icon: "Kanban" },
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" }
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-secondary-200 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="GitBranch" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">IssueFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-primary"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search issues..."
              className="w-80"
            />
<Button onClick={onCreateIssue} size="md">
              <ApperIcon name="Plus" size={18} />
              <span className="ml-2">New Issue</span>
            </Button>
            <Button onClick={logout} variant="outline" size="md">
              <ApperIcon name="LogOut" size={18} />
              <span className="ml-2">Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="p-4 space-y-4">
                <SearchBar
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder="Search issues..."
                />
                
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-primary-50 text-primary"
                            : "text-secondary-600 hover:bg-secondary-50"
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} size={20} />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <Button onClick={() => { onCreateIssue(); setMobileMenuOpen(false); }} className="w-full" size="lg">
                  <ApperIcon name="Plus" size={20} />
                  <span className="ml-2">New Issue</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;