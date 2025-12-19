import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserStatus, deleteUser } from '../../services/AdminService';
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../widgets/Navbar/Navbar";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";
import Modal from "../../shared/components/Modal";
import Spinner from "../../shared/components/Spinner";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(searchTerm);
      let rawData = [];
      if (Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        rawData = res.data.results;
      }

      const unique = [];
      const map = new Map();
      for (const u of rawData) {
        const userId = u.id || u._id;
        if (userId && !map.has(userId)) {
          map.set(userId, true);
          unique.push({ ...u, id: userId });
        }
      }
      setUsers(unique);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentIsActive) => {
    const newIsActive = !currentIsActive;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newIsActive } : u));
    try {
      await updateUserStatus(userId, newIsActive);
    } catch (err) {
      console.error("Failed to update status", err);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: currentIsActive } : u));
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Admin Console" user={authUser} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-500 tracking-wider mb-1 uppercase">
              Directory
            </p>
            <h1 className="text-3xl font-bold text-slate-800">
              User Management
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-64">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0" // Reset standard input margin
              />
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl mb-6 w-fit border border-slate-200 shadow-sm">
          {["all", "architect", "engineer", "client"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
            >
              {tab === "all" ? "All Users" : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* User Table */}
        <Card className="overflow-hidden border-indigo-100 p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center"><Spinner color="indigo" /></div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {u.first_name} {u.last_name || ""}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${u.role === "admin" ? "bg-purple-50 text-purple-600 border-purple-100"
                            : u.role === "architect" ? "bg-sky-50 text-sky-600 border-sky-100"
                              : u.role === "engineer" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${u.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                          {u.is_active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant={u.is_active ? "danger" : "secondary"}
                          size="sm"
                          onClick={() => handleStatusToggle(u.id, u.is_active)}
                        >
                          {u.is_active ? "Suspend" : "Activate"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(u)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-transparent"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to permanently delete
            <span className="font-semibold text-slate-900"> {userToDelete?.first_name} {userToDelete?.last_name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} isLoading={isDeleting}>
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
