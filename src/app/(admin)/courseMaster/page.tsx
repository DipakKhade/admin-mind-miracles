"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/DataTable";
import {
  Plus,
  X,
  Loader2,
  Pencil,
  Eye,
  UserPlus,
  Check,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  previewURL: string;
  createdAt: string;
}

interface EnrolledUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  certificationId: string;
  enrolledAt: string;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
}

function CourseFormModal({
  course,
  onClose,
  onSuccess,
}: {
  course?: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!course;
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: course?.title ?? "",
    description: course?.description ?? "",
    price: course?.price?.toString() ?? "",
    previewURL: course?.previewURL ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const url = "/api/courseMaster";
      const method = isEdit ? "PATCH" : "POST";
      const body = JSON.stringify({
        ...(isEdit ? { id: course.id } : {}),
        title: form.title,
        description: form.description,
        price: form.price,
        previewURL: form.previewURL,
      });

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save course");
        return;
      }

      toast.success(isEdit ? "Course updated" : "Course created");
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Course" : "Add New Course"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              placeholder="Course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm resize-none"
              placeholder="Course description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              placeholder="e.g. 1499"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview URL
            </label>
            <input
              value={form.previewURL}
              onChange={(e) => setForm({ ...form, previewURL: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              placeholder="Preview video ID or URL"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CourseUsersModal({
  courseId,
  courseTitle,
  onClose,
}: {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<EnrolledUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const fetchEnrolled = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/enrollment?courseId=${courseId}`);
      if (res.ok) setUsers(await res.json());
    } catch {
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchEnrolled();
  }, [fetchEnrolled]);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setSelectedUser(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}`);
        if (res.ok) setSearchResults(await res.json());
      } catch {
        // silently fail
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  async function handleAdd() {
    if (!selectedUser) return;
    setAdding(true);
    try {
      const res = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, userId: selectedUser.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to add user");
        return;
      }
      toast.success("User enrolled successfully");
      setSearchTerm("");
      setSearchResults([]);
      setSelectedUser(null);
      fetchEnrolled();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(enrollmentId: string) {
    setConfirmDelete(enrollmentId);
  }

  async function confirmRemove() {
    if (!confirmDelete) return;
    setRemoving(confirmDelete);
    try {
      const res = await fetch("/api/enrollment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmDelete }),
      });
      if (!res.ok) {
        toast.error("Failed to remove user");
        return;
      }
      toast.success("User removed from course");
      fetchEnrolled();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemoving(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Course Users</h2>
            <p className="text-sm text-gray-500 truncate max-w-md">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New User
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email (min 2 chars)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A]"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {searchResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(u);
                        setSearchTerm(`${u.name} (${u.email})`);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="font-medium">{u.name}</span>
                      <span className="text-gray-400">{u.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={!selectedUser || adding}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Add
            </button>
          </div>
          {selectedUser && (
            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
              <Check className="w-3 h-3" />
              Selected: {selectedUser.name} ({selectedUser.email})
            </div>
          )}
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">No users enrolled yet</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Certification</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled At</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.userEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.certificationId || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.enrolledAt ? new Date(u.enrolledAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(u.id)}
                        disabled={removing === u.id}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors ml-auto"
                      >
                        {removing === u.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {confirmDelete && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Remove User</h3>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to remove this user from the course?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  disabled={removing === confirmDelete}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-1.5"
                >
                  {removing === confirmDelete && <Loader2 className="w-3 h-3 animate-spin" />}
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseMasterPage() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [usersModal, setUsersModal] = useState<{ id: string; title: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/courseMaster");
      if (res.ok) setData(await res.json());
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: Column<Course>[] = [
    { key: "title", header: "Title", width: 300, frozen: true, sortable: true },
    {
      key: "price",
      header: "Price",
      width: 100,
      sortable: true,
      render: (row) => (
        <span className="font-medium">₹{row.price.toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      width: 100,
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "createdAt", header: "Created", width: 130, sortable: true },
    {
      key: "actions" as never,
      header: "",
      width: 200,
      frozen: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditCourse(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => setUsersModal({ id: row.id, title: row.title })}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            See Users
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Master</h1>
          <p className="text-gray-500 mt-1">Manage courses and enrollments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          pageSize={10}
          searchable
          sortable
          getRowId={(row) => row.id}
        />
      )}

      {showAddModal && (
        <CourseFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {editCourse && (
        <CourseFormModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSuccess={fetchData}
        />
      )}

      {usersModal && (
        <CourseUsersModal
          courseId={usersModal.id}
          courseTitle={usersModal.title}
          onClose={() => setUsersModal(null)}
        />
      )}
    </div>
  );
}
