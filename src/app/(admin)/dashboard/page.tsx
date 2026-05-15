"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  CalendarClock,
  TrendingUp,
  Activity,
  IndianRupee,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RevenueModal from "@/components/RevenueModal";

export default function DashboardPage() {
  const router = useRouter();
  const [revenue, setRevenue] = useState(0);
  const [clients, setClients] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [revRes, cliRes, sesRes] = await Promise.all([
        fetch("/api/revenue"),
        fetch("/api/clientMaster"),
        fetch("/api/sessionMaster"),
      ]);
      if (revRes.ok) {
        const d = await revRes.json();
        setRevenue(d.totalRevenue ?? 0);
      }
      if (cliRes.ok) {
        const d = await cliRes.json();
        setClients(Array.isArray(d) ? d.length : 0);
      }
      if (sesRes.ok) {
        const d = await sesRes.json();
        setSessions(Array.isArray(d) ? d.filter((s: { status: string }) => s.status === "Active").length : 0);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    {
      label: "Total Clients",
      value: clients.toLocaleString("en-IN"),
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      onClick: () => router.push("/clientMaster"),
    },
    {
      label: "Active Sessions",
      value: sessions.toLocaleString("en-IN"),
      icon: CalendarClock,
      color: "text-blue-600",
      bg: "bg-blue-50",
      onClick: () => router.push("/sessionMaster"),
    },
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      onClick: () => setModalOpen(true),
    },
    // {
    //   label: "This Month",
    //   value: "—",
    //   icon: TrendingUp,
    //   color: "text-violet-600",
    //   bg: "bg-violet-50",
    //   onClick: undefined,
    // },
    // {
    //   label: "Active Now",
    //   value: "—",
    //   icon: Activity,
    //   color: "text-amber-600",
    //   bg: "bg-amber-50",
    //   onClick: undefined,
    // },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your practice</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const clickable = !!stat.onClick;
          return (
            <div
              key={stat.label}
              onClick={stat.onClick}
              className={`bg-white rounded-xl border border-gray-200 p-5 ${
                clickable
                  ? "cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <RevenueModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
