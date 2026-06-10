"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import https, { sendRequest } from "@/lib/api";
import { useDashboardChartTopQuery } from "@/features/dashboard/use-dashboard-query";

interface ChartTopItem {
  CompanyTaxCode: string;
  CHI_TIEU: string;
  TEN_CHI_TIEU: string;
  SO_LUONG: number;
  Balance: number;
  BalanceNT: number;
}

const COLORS = [
  "#3b82f6", // blue-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#f43f5e", // rose-500
  "#64748b", // slate-500
  "#a855f7", // purple-500
  "#0ea5e9", // sky-500
  "#84cc16", // lime-500
];

function formatVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  return new Intl.NumberFormat("vi-VN").format(value);
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item: ChartTopItem = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{item.TEN_CHI_TIEU}</p>
      <p className="text-muted-foreground">
        Doanh thu:{" "}
        <span className="font-medium text-foreground">
          {new Intl.NumberFormat("vi-VN").format(item.Balance)} đ
        </span>
      </p>
      {item.SO_LUONG > 0 && (
        <p className="text-muted-foreground">
          Số lượng:{" "}
          <span className="font-medium text-foreground">
            {new Intl.NumberFormat("vi-VN").format(item.SO_LUONG)}
          </span>
        </p>
      )}
    </div>
  );
}

const chartConfig = {
  Balance: { label: "Doanh thu" },
};

export default function ChartTop() {
  const { data, error, isLoading } = useDashboardChartTopQuery({
    chart: 1,
    type: 1,
    endTime: "1798736399999",
    startTime: "1767200400000",
    serviceId: "VP",
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton
                className="h-6 rounded-md"
                style={{ width: `${60 - i * 8}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Rút ngắn tên để vừa trục Y
  const displayData = data?.map((d: ChartTopItem) => ({
    ...d,
    shortName:
      d.TEN_CHI_TIEU.length > 22
        ? d.TEN_CHI_TIEU.slice(0, 20) + "…"
        : d.TEN_CHI_TIEU,
  }));

  const maxBalance = Math.max(...displayData.map((d) => d.Balance), 1);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Top sản phẩm / dịch vụ
        </h2>
        <p className="text-xs text-muted-foreground">Theo doanh thu</p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{ height: displayData.length * 48 + 24 }}
      >
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 8 }}
          barSize={20}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border/40"
          />

          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={formatVND}
            domain={[0, maxBalance * 1.1]}
          />

          <YAxis
            type="category"
            dataKey="shortName"
            width={140}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hslvar(--muted) / 0.4)" }}
          />

          <Bar dataKey="Balance" radius={[0, 6, 6, 0]}>
            {displayData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
