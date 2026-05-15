"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/DataTable";
import {
  FileText,
  X,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  place: string;
  registeredDate: string;
}

interface SessionRecord {
  id: string;
  clientId: string;
  clientName: string;
  sessionsRequired: number;
  sessionsCompleted: number;
  status: string;
  createdAt: string;
}

interface FeeRecord {
  id: string;
  sessionId: string;
  feeType: string;
  totalFee: number;
  installmentsCount: number;
}

function CaseHistoryModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sessRes, feesRes] = await Promise.all([
          fetch(`/api/sessionMaster?clientId=${client.id}`),
          fetch(`/api/sessionFeeMaster`),
        ]);
        const sessData = await sessRes.json();
        const feesData = await feesRes.json();
        setSessions(sessData);
        setFees(feesData);
      } catch {
        toast.error("Failed to load case history");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [client.id]);

  const totalFee = fees.reduce((s, f) => s + f.totalFee, 0);

  return (
    <>
      {/* Print Report (hidden on screen) */}
      <div className="print-report">
        <div className="print-report-inner">
          <div className="print-header">
            <img src="/mind_miracles_logo.png" alt="Mind Miracles" className="print-logo" />
            <div>
              <h1>Mind Miracles</h1>
              <p>Psychological Healing &amp; Hypnotherapy Center</p>
              <p className="print-contact">+91-779-808-2219 | mindmiracles1707@gmail.com</p>
            </div>
          </div>

          <div className="print-divider" />

          <h2 className="print-title">Case History Report</h2>

          <table className="print-info-table">
            <tbody>
              <tr><td className="print-label">Client Name</td><td>{client.name}</td></tr>
              <tr><td className="print-label">Phone</td><td>{client.phone}</td></tr>
              <tr><td className="print-label">Email</td><td>{client.email}</td></tr>
              <tr><td className="print-label">Age / Gender</td><td>{client.age} / {client.gender}</td></tr>
              <tr><td className="print-label">Place</td><td>{client.place}</td></tr>
              <tr><td className="print-label">Registered On</td><td>{formatDate(client.registeredDate)}</td></tr>
            </tbody>
          </table>

          <div className="print-divider" />

          <table className="print-sessions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sessions</th>
                <th>Completed</th>
                <th>Status</th>
                <th>Started</th>
                <th>Fee (₹)</th>
                <th>Payment Type</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => {
                const fee = fees.find((f) => f.sessionId === s.id);
                return (
                  <tr key={s.id}>
                    <td className="print-center">{i + 1}</td>
                    <td>{s.sessionsRequired}</td>
                    <td className="print-center">{s.sessionsCompleted}</td>
                    <td>{s.status}</td>
                    <td>{formatDate(s.createdAt)}</td>
                    <td className="print-right">{fee ? fee.totalFee.toLocaleString() : "—"}</td>
                    <td>{fee ? (fee.feeType === "installments" ? `Installments (${fee.installmentsCount})` : "One Time") : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="print-right print-bold">Total Fee</td>
                <td className="print-right print-bold">₹{totalFee.toLocaleString()}</td>
                <td />
              </tr>
            </tfoot>
          </table>

          {sessions.length === 0 && (
            <p className="print-empty">No session records found.</p>
          )}

          <div className="print-footer">
            <p>Report generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            <p className="print-footer-brand">Mind Miracles Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Modal (screen only) */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[75vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{client.name}</h2>
              <p className="text-sm text-gray-500">
                {client.phone} &middot; {client.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No sessions recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const fee = fees.find((f) => f.sessionId === session.id);

                  return (
                    <div
                      key={session.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            Session Package
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.sessionsCompleted} of {session.sessionsRequired} sessions completed
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === "Active"
                              ? "bg-blue-50 text-blue-700"
                              : session.status === "Closed"
                              ? "bg-gray-100 text-gray-500"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {session.status === "Active" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {session.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>Started {formatDate(session.createdAt)}</span>
                      </div>

                      {fee && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Fee</span>
                            <span className="font-medium text-gray-900">
                              ₹{fee.totalFee.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Payment Type</span>
                            <span className="font-medium text-gray-700">
                              {fee.feeType === "installments"
                                ? `Installments (${fee.installmentsCount})`
                                : "One Time"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AddClientModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    place: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clientMaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to add client");
        return;
      }
      toast.success("Client added successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Add New Client</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              placeholder="Full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                placeholder="+91-XXXXX-XXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place
            </label>
            <input
              type="text"
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors text-sm"
              placeholder="City"
            />
          </div>

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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const columns: Column<Client>[] = [
  { key: "name", header: "Name", width: 200, frozen: true, sortable: true },
  { key: "email", header: "Email", width: 240, sortable: true },
  { key: "phone", header: "Phone", width: 170 },
  { key: "age", header: "Age", width: 70, sortable: true },
  { key: "gender", header: "Gender", width: 100, sortable: true },
  { key: "place", header: "Place", width: 150, sortable: true },
  { key: "registeredDate", header: "Registered", width: 130, sortable: true },
];

export default function ClientMasterPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/clientMaster");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dataColumns: Column<Client>[] = [
    ...columns,
    {
      key: "actions" as never,
      header: "",
      width: 160,
      frozen: true,
      render: (row) => (
        <button
          onClick={() => setSelectedClient(row)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          See Case History
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Master</h1>
          <p className="text-gray-500 mt-1">Manage your clients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D2B1F] rounded-lg hover:bg-[#1B5E3A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Client
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

      {selectedClient && (
        <CaseHistoryModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
