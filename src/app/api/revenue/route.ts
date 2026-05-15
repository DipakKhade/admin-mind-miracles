import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const fees = await getCollection("mindmiracles", "sessionFeeMaster");

    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$createdAt" } },
            month: { $month: { $toDate: "$createdAt" } },
          },
          total: { $sum: "$totalFee" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const aggregated = await fees.aggregate(pipeline).toArray();

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    let totalRevenue = 0;
    const monthlyData: { month: string; value: number; count: number }[] = [];
    const yearlyMap = new Map<number, number>();

    for (const item of aggregated) {
      const { year, month } = item._id;
      const value = item.total;
      totalRevenue += value;

      monthlyData.push({
        month: `${months[month - 1]} ${year}`,
        value,
        count: item.count,
      });

      yearlyMap.set(year, (yearlyMap.get(year) || 0) + value);
    }

    const yearlyData = Array.from(yearlyMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, value]) => ({ year: String(year), value }));

    return NextResponse.json({ totalRevenue, monthlyData, yearlyData });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
