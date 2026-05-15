"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/DataTable";
import {
  Plus,
  X,
  Loader2,
  IndianRupee,
  Pencil,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Session {
  id: string;
  clientId: string;
  clientName: string;
  sessionsRequired: number;
  sessionsCompleted: number;
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
}

function SessionFormModal({
  session,
  onClose,
  onSuccess,
}: {
  session?: Session | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!session;
  const [form, setForm] = useState({
    clientId: session?.clientId ?? "",
    sessionsRequired: session?.sessionsRequired.toString() ?? "",
    sessionsCompleted: session?.sessionsCompleted.toString() ?? "0",
    feeType: "one_time" as "one_time" | "installments",
    totalFee: "",
    installmentsCount: "",
  });

  useEffect(() => {
    fetch("/api/clientMaster")
      .then((r) => r.json())
      .then((data) => setClients(data))
      .catch(() => toast.error("Failed to load clients"))
      .finally(() => setLoadingClients(false));
  }, []);

  const selectedClient = clients.find((c) => c.id === form.clientId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEdit) {
      if (!form.sessionsRequired || Number(form.sessionsRequired) < 1) {
        toast.error("Sessions required must be at least 1");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/sessionMaster", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: session.id,
            sessionsRequired: form.sessionsRequired,
            sessionsCompleted: form.sessionsCompleted,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to update session");
          return;
        }

        toast.success("Session updated successfully");
        onSuccess();
        onClose();
      } catch {
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!form.clientId) {
      toast.error("Please select a client");
      return;
    }
    if (!form.sessionsRequired || Number(form.sessionsRequired) < 1) {
      toast.error("Sessions required must be at least 1");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/sessionMaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientId,
          clientName: selectedClient?.name ?? "",
          sessionsRequired: form.sessionsRequired,
          feeType: form.feeType,
          totalFee: form.totalFee || 0,
          installmentsCount: form.installmentsCount || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create session");
        return;
      }

      toast.success("Session created successfully");
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
            {isEdit ? "Edit Session" : "Add New Session"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                {loadingClients ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading clients...
                  </div>
                ) : (
                  <select
                    required
                    value={form.clientId}
                    onChange={(e) =>
                      setForm({ ...form, clientId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                  >
                    <option value="">Select a client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}

          {isEdit && (
            <>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                <span className="font-medium">Client:</span> {session.clientName}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessions Required
                </label>
                <input
                  type="number"
                  value={form.sessionsRequired}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Session Progress
                  </label>
                  <span className="text-sm font-semibold text-gray-900">
                    {form.sessionsCompleted} / {form.sessionsRequired} completed
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${form.sessionsRequired && Number(form.sessionsRequired) > 0
                        ? (Number(form.sessionsCompleted) / Number(form.sessionsRequired)) * 100
                        : 0}%`,
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {Array.from(
                    { length: Number(form.sessionsRequired) || 0 },
                    (_, i) => {
                      const done = i < Number(form.sessionsCompleted);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              sessionsCompleted: String(
                                done ? i : i + 1
                              ),
                            })
                          }
                          className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all cursor-pointer
                            ${done
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-sm scale-100"
                              : "bg-white border-gray-200 text-gray-300 hover:border-emerald-300 hover:text-emerald-400"
                            }`}
                        >
                          {done ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        sessionsCompleted: form.sessionsRequired,
                      })
                    }
                    disabled={
                      Number(form.sessionsCompleted) >=
                      Number(form.sessionsRequired)
                    }
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Mark All Complete
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, sessionsCompleted: "0" })
                    }
                    disabled={Number(form.sessionsCompleted) === 0}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessions Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.sessionsRequired}
                  onChange={(e) =>
                    setForm({ ...form, sessionsRequired: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                  placeholder="e.g. 10"
                />
              </div>

              <hr className="border-gray-100" />

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Fee Structure
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="feeType"
                        value="one_time"
                        checked={form.feeType === "one_time"}
                        onChange={() =>
                          setForm({ ...form, feeType: "one_time" })
                        }
                        className="accent-[#0D2B1F]"
                      />
                      One Time Payment
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="feeType"
                        value="installments"
                        checked={form.feeType === "installments"}
                        onChange={() =>
                          setForm({ ...form, feeType: "installments" })
                        }
                        className="accent-[#0D2B1F]"
                      />
                      Pay Installments
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.totalFee}
                      onChange={(e) =>
                        setForm({ ...form, totalFee: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  {form.feeType === "installments" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Installments
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.installmentsCount}
                        onChange={(e) =>
                          setForm({ ...form, installmentsCount: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                        placeholder="e.g. 5"
                      />
                      {form.totalFee && Number(form.installmentsCount) > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          ₹{Math.round(Number(form.totalFee) / Number(form.installmentsCount)).toLocaleString()} per installment
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const columns: Column<Session>[] = [
  { key: "clientName", header: "Client Name", width: 200, frozen: true, sortable: true },
  { key: "sessionsRequired", header: "Sessions Required", width: 160, sortable: true },
  { key: "sessionsCompleted", header: "Completed", width: 130, sortable: true },
  {
    key: "status",
    header: "Status",
    width: 110,
    sortable: true,
    render: (row) => (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === "Active"
            ? "bg-blue-50 text-blue-700"
            : row.status === "Closed"
            ? "bg-gray-100 text-gray-500"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            row.status === "Active"
              ? "bg-blue-500"
              : row.status === "Closed"
              ? "bg-gray-400"
              : "bg-emerald-500"
          }`}
        />
        {row.status}
      </span>
    ),
  },
  { key: "createdAt", header: "Created", width: 130, sortable: true },
];

export default function SessionMasterPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/sessionMaster");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleClose(id: string) {
    if (!confirm("Are you sure you want to close this session?")) return;

    setClosingId(id);
    try {
      const res = await fetch("/api/sessionMaster", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Closed" }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to close session");
        return;
      }

      toast.success("Session closed");
      fetchData();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setClosingId(null);
    }
  }

  const dataColumns: Column<Session>[] = [
    ...columns,
    {
      key: "actions" as never,
      header: "",
      width: 170,
      frozen: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditSession(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          {row.status === "Active" && (
            <button
              onClick={() => handleClose(row.id)}
              disabled={closingId === row.id}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {closingId === row.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              Close
            </button>
          )}
          {row.status === "Closed" && (
            <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Done
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session Master</h1>
          <p className="text-gray-500 mt-1">Manage therapy sessions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Session
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DataTable
          data={data}
          columns={dataColumns}
          pageSize={10}
          searchable
          sortable
          getRowId={(row) => row.id}
        />
      )}

      {showAddModal && (
        <SessionFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {editSession && (
        <SessionFormModal
          session={editSession}
          onClose={() => setEditSession(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
