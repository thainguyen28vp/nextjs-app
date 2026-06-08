"use client";

import https, { sendRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";

interface StatisticInvoice {
  SO_LUONG_BAN: number;
  TIEN_BAN: number;
  SO_LUONG_TRA: number;
  TIEN_TRA: number;
  SO_LUONG_HOM_QUA: number;
  TIEN_BAN_HOM_QUA: number;
  TY_LE_NGAY: number;
  SO_LUONG_THANG: number;
  TIEN_BAN_THANG: number;
  SO_LUONG_THANG_TRUOC: number;
  TIEN_THANG_TRUOC: number;
  TY_LE_THANG: number;
}

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " %";
}

function StatCard({
  icon,
  iconBg,
  count,
  countLabel,
  amount,
  label,
  labelColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  count: number;
  countLabel: string;
  amount: number;
  label: string;
  labelColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full `}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">
          {count} {countLabel}
        </p>
        <p className="text-lg font-medium text-foreground leading-tight">
          {formatVND(amount)}
        </p>
        <p className={`text-sm font-light ${labelColor}`}>{label}</p>
      </div>
    </div>
  );
}

function PercentCard({
  icon,
  iconBg,
  percent,
  label,
  sublabel,
  percentColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  percent: number;
  label: string;
  sublabel: string;
  percentColor: string;
}) {
  return (
    <div className="flex items-start gap-3 ">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-lg font-medium leading-tight ${percentColor}`}>
          {formatPercent(percent)}
        </p>
        <p className="text-sm text-sky-500 font-light">{sublabel}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-4"
        >
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ViewStatisticInvoice() {
  const [data, setData] = useState<StatisticInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // const res = await sendRequest<{ data: StatisticInvoice[] }>({
        //   url: "/api/view-statistic-invoice",
        //   method: "GET",
        //   queryParams: {
        //     serviceId: "VP",
        //     startTime: "1767200400000",
        //     endTime: "1798736399999",
        //   },
        // });
        const res = await https.get(`/api/dashboard/view-statistic-invoice`, {
          endTime: "1798736399999",
          serviceId: "VP",
          startTime: "1767200400000",
        });
        if (res?.data?.[0]) {
          setData(res.data[0]);
        }
      } catch {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const dayGrowthUp = data.TY_LE_NGAY >= 0;
  const monthGrowthUp = data.TY_LE_THANG >= 0;

  return (
    <div className="w-full space-y-3 bg-background rounded-3xl p-3 shadow-lg border border-border">
      <h2 className="text-base font-semibold text-foreground">
        Tổng quan tài chính
      </h2>
      <div className="grid grid-cols-2 gap-3 ">
        {/* Doanh thu hôm nay */}
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-sky-500" />}
          iconBg="bg-sky-500/15"
          count={data.SO_LUONG_BAN}
          countLabel="Hóa đơn"
          amount={data.TIEN_BAN}
          label="Doanh thu"
          labelColor="text-sky-500"
        />

        {/* Trả hàng */}
        <StatCard
          icon={<RotateCcw className="h-5 w-5 text-orange-500" />}
          iconBg="bg-orange-500/15"
          count={data.SO_LUONG_TRA}
          countLabel="Phiếu"
          amount={data.TIEN_TRA}
          label="Trả hàng"
          labelColor="text-orange-500"
        />

        {/* So với hôm qua */}
        <PercentCard
          icon={
            dayGrowthUp ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-rose-500" />
            )
          }
          iconBg={dayGrowthUp ? "bg-emerald-500/15" : "bg-rose-500/15"}
          percent={data.TY_LE_NGAY}
          label="Hóa đơn"
          sublabel="So với hôm qua"
          percentColor={dayGrowthUp ? "text-emerald-500" : "text-rose-500"}
        />

        {/* So với tháng trước */}
        <PercentCard
          icon={
            monthGrowthUp ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-rose-500" />
            )
          }
          iconBg={monthGrowthUp ? "bg-emerald-500/15" : "bg-rose-500/15"}
          percent={data.TY_LE_THANG}
          label="Hóa đơn"
          sublabel="So với tháng trước"
          percentColor={monthGrowthUp ? "text-emerald-500" : "text-rose-500"}
        />
      </div>
    </div>
  );
}
