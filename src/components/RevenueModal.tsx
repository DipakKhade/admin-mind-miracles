"use client";

import { useEffect, useState } from "react";
import { X, IndianRupee, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = { month: string; value: number; count: number };
type YearlyData = { year: string; value: number };

export default function RevenueModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [yearly, setYearly] = useState<YearlyData[]>([]);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (!open) return;
    fetch("/api/revenue")
      .then((r) => r.json())
      .then((d) => {
        setMonthly(d.monthlyData ?? []);
        setYearly(d.yearlyData ?? []);
        setTotal(d.totalRevenue ?? 0);
      });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Total Revenue</h2>
              <p className="text-sm text-gray-500">
                ₹{total.toLocaleString("en-IN")} collected across{" "}
                {monthly.reduce((s, m) => s + m.count, 0)} fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView("monthly")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                view === "monthly"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Monthly
            </button>
            <button
              onClick={() => setView("yearly")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                view === "yearly"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Yearly
            </button>
          </div>

          {view === "monthly" ? (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-600 mb-4">
                Month-wise Collection
              </p>
              {monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#059669"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No revenue data yet
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-600 mb-4">
                Year-wise Collection
              </p>
              {yearly.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={yearly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#059669"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No revenue data yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
