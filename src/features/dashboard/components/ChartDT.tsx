"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import https, { sendRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  useDashboardChartTopQuery,
  useDashboardViewChartDtQuery,
} from "@/hooks/use-dashboard-query";

interface ChartDTRaw {
  MA_DV: string;
  NGAY_CT: string;
  THANG: number;
  SO_LUONG: number;
  Balance: number;
  BalanceNT: number;
}

interface ChartDTMonthly {
  month: string; // "T1", "T2", ...
  Balance: number; // tổng doanh thu
  SO_LUONG: number; // tổng số lượng
}

/** Group nhiều bản ghi cùng tháng → 1 bản ghi tổng hợp */

function formatBalance(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}tr`;
  return String(value);
}

function formatQty(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg text-sm space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-muted-foreground">
          {p.name}:{" "}
          <span className="font-medium" style={{ color: p.color }}>
            {p.dataKey === "Balance"
              ? new Intl.NumberFormat("vi-VN").format(p.value) + " đ"
              : new Intl.NumberFormat("vi-VN").format(p.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

const chartConfig = {
  Balance: { label: "Số tiền" },
  SO_LUONG: { label: "Số lượng" },
};

export default function ChartDT() {
  const { data, error, isLoading } = useDashboardViewChartDtQuery({
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
        <Skeleton className="h-[280px] w-full rounded-xl" />
      </div>
    );
  }

  const maxBalance = Math.max(...data?.map((d) => d.Balance), 1);
  const maxQty = Math.max(...data?.map((d) => d.SO_LUONG), 1);

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm">
      <div className="mb-4 p-5">
        <h2 className="text-base font-semibold text-foreground">
          Doanh thu theo tháng
        </h2>
        <p className="text-xs text-muted-foreground">Số tiền &amp; số lượng</p>
      </div>

      <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
        <ComposedChart
          data={data}
          margin={{ left: 6, right: 6 }}
          barGap={4}
          barCategoryGap="30%"
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-border/40"
          />

          {/* Trục X: tháng */}
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 13 }}
          />

          {/* Trục Y trái: tiền */}
          <YAxis
            yAxisId="balance"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={formatBalance}
            domain={[0, maxBalance * 1.2]}
            width={52}
          />

          {/* Trục Y phải: số lượng */}
          <YAxis
            yAxisId="qty"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={formatQty}
            domain={[0, maxQty * 1.2]}
            width={44}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
          />

          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) =>
              value === "Balance" ? "Số tiền" : "Số lượng"
            }
          />

          {/* Line: Số lượng (teal) */}
          <Line
            yAxisId="qty"
            type="monotone"
            dataKey="SO_LUONG"
            name="SO_LUONG"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />

          {/* Bar: Số tiền (orange) */}
          <Bar
            yAxisId="balance"
            dataKey="Balance"
            name="Balance"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
            barSize={18}
          >
            {/* <LabelList
              position="top"
              style={{ fontSize: 10, fill: "#7c3aed", fontWeight: 600 }}
              formatter={(v: number) => (v > 0 ? formatBalance(v) : "")}
            /> */}
          </Bar>
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
