"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    LabelList,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { sendRequest } from "@/utils/api";
import { useEffect, useState } from "react";

interface ChartDTRaw {
    MA_DV: string;
    NGAY_CT: string;
    THANG: number;
    SO_LUONG: number;
    Balance: number;
    BalanceNT: number;
}

interface ChartDTMonthly {
    month: string;     // "T1", "T2", ...
    Balance: number;   // tổng doanh thu
    SO_LUONG: number;  // tổng số lượng
}

/** Group nhiều bản ghi cùng tháng → 1 bản ghi tổng hợp */
function aggregateByMonth(data: ChartDTRaw[]): ChartDTMonthly[] {
    const map = new Map<number, ChartDTMonthly>();
    for (const item of data) {
        const m = item.THANG;
        if (!map.has(m)) {
            map.set(m, { month: `T${m}`, Balance: 0, SO_LUONG: 0 });
        }
        const entry = map.get(m)!;
        entry.Balance += item.Balance;
        entry.SO_LUONG += item.SO_LUONG;
    }
    // Sắp xếp theo tháng tăng dần
    return Array.from(map.values()).sort(
        (a, b) => parseInt(a.month.slice(1)) - parseInt(b.month.slice(1))
    );
}

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
    const [chartData, setChartData] = useState<ChartDTMonthly[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await sendRequest<{ data: ChartDTRaw[] }>({
                    url: "/api/view-chart-dt",
                    method: "GET",
                    queryParams: {
                        endTime: "1798736399999",
                        serviceId: "VP",
                        startTime: "1767200400000",
                        chart: 1,
                    },
                });
                if (res?.data) {
                    setChartData(aggregateByMonth(res.data));
                }
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-[280px] w-full rounded-xl" />
            </div>
        );
    }

    const maxBalance = Math.max(...chartData.map((d) => d.Balance), 1);
    const maxQty = Math.max(...chartData.map((d) => d.SO_LUONG), 1);

    return (
        <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground">Doanh thu theo tháng</h2>
                <p className="text-xs text-muted-foreground">Số tiền &amp; số lượng</p>
            </div>

            <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
                <ComposedChart
                    data={chartData}
                    margin={{ top: 24, right: 48, bottom: 8, left: 8 }}
                    barGap={4}
                    barCategoryGap="30%"
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />

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

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />

                    <Legend
                        wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                        formatter={(value) =>
                            value === "Balance" ? "Số tiền" : "Số lượng"
                        }
                    />

                    {/* Bar: Số lượng (teal) */}
                    <Bar
                        yAxisId="qty"
                        dataKey="SO_LUONG"
                        name="SO_LUONG"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        barSize={18}
                    >
                        <LabelList
                            position="top"
                            style={{ fontSize: 10, fill: "#7c3aed", fontWeight: 600 }}
                            formatter={(v: number) => (v > 0 ? new Intl.NumberFormat("vi-VN").format(v) : "")}
                        />
                    </Bar>

                    {/* Bar: Số tiền (orange) */}
                    <Bar
                        yAxisId="balance"
                        dataKey="Balance"
                        name="Balance"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        barSize={18}
                    >
                        <LabelList
                            position="top"
                            style={{ fontSize: 10, fill: "#7c3aed", fontWeight: 600 }}
                            formatter={(v: number) => (v > 0 ? formatBalance(v) : "")}
                        />
                    </Bar>
                </ComposedChart>
            </ChartContainer>
        </div>
    );
}
