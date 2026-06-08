"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { sendRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ChartTopItem {
    CompanyTaxCode: string;
    CHI_TIEU: string;
    TEN_CHI_TIEU: string;
    SO_LUONG: number;
    Balance: number;
    BalanceNT: number;
}

function formatVND(value: number): string {
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

function TableRowSkeleton() {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-border/40 py-3 last:border-0">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-28" />
        </div>
    );
}

export function ViewChartTop() {
    const [data, setData] = useState<ChartTopItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const rs = await sendRequest<{ data: ChartTopItem[] }>({
                    url: "/api/view-chart-top",
                    method: "GET",
                    queryParams: {
                        endTime: "1798736399999",
                        serviceId: "VP",
                        startTime: "1767200400000",
                        chart: 1,
                        type: 1
                    },
                });
                if (rs?.data) {
                    setData(rs.data);
                }
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        loadData(); // ← fix: gọi hàm
    }, []);

    return (
        <section className="rounded-2xl border border-border/50 bg-card shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="text-base font-semibold text-foreground">Thống kê số phiếu</h2>
                <button className="flex items-center gap-1 rounded-xl border border-border/50 bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50 transition-colors">
                    Năm nay
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
            </div>

            {/* Table header */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
                <span className="flex-1 text-sm font-semibold text-sky-500">Tên phiếu</span>
                <span className="w-16 text-center text-sm font-semibold text-sky-500">Số phiếu</span>
                <span className="w-36 text-right text-sm font-semibold text-sky-500">Tiền</span>
            </div>

            {/* Rows */}
            <div className="px-4 pb-2">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : data.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Không có dữ liệu
                    </p>
                ) : (
                    data.map((item, idx) => (
                        <div
                            key={item.CHI_TIEU + idx}
                            className="flex items-center justify-between gap-3 border-b border-border/30 py-3 last:border-0"
                        >
                            <span className="flex-1 truncate text-sm text-sky-500 font-medium">
                                {item.TEN_CHI_TIEU}
                            </span>
                            <span className="w-16 text-center text-sm text-foreground">
                                {item.SO_LUONG > 0
                                    ? new Intl.NumberFormat("vi-VN").format(item.SO_LUONG)
                                    : "—"}
                            </span>
                            <span className="w-36 text-right text-sm font-medium text-foreground">
                                {formatVND(item.Balance)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}