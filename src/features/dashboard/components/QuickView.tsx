"use client";

import { useEffect, useState } from "react";
import https, { sendRequest } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Banknote,
  Building2,
  CreditCard,
  HandCoins,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Users,
  ShoppingCart,
  Package,
} from "lucide-react";

interface QuickViewItem {
  ItemId: string;
  Items: string;
  ItemsEn: string;
  Account: string;
  AccountType: number; // 0=asset, 1=liability, 2=expense, 3=revenue
  STT: number;
  Balance: number;
  BalanceNT: number;
}

// Map icon theo ItemId
const ICON_MAP: Record<string, React.ElementType> = {
  TM: Banknote,
  TG: Building2,
  TV: CreditCard,
  TU: HandCoins,
  DT: TrendingUp,
  CP: TrendingDown,
  LG: BarChart3,
  PT: Users,
  PTR: ShoppingCart,
  TK: Package,
};

// Màu icon theo AccountType
const TYPE_ICON_COLOR: Record<number, string> = {
  0: "text-emerald-500",
  1: "text-rose-500",
  2: "text-orange-500",
  3: "text-sky-500",
};

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

function QuickViewCard({ item }: { item: QuickViewItem }) {
  const Icon = ICON_MAP[item.ItemId] ?? BarChart3;
  const iconColor = TYPE_ICON_COLOR[item.AccountType] ?? TYPE_ICON_COLOR[0];

  return (
    <div className="flex flex-col items-center gap-1.5 py-2 px-3 text-center bg-">
      <div className="flex items-center justify-center gap-3">
        <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground leading-tight">
          {item.Items}
        </p>
      </div>
      <p className="text-base font-medium text-foreground leading-snug">
        {formatVND(item.Balance)}
      </p>
    </div>
  );
}

function QuickViewSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/40 bg-card px-3 py-4 text-center"
        >
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </>
  );
}

export function QuickView() {
  const [data, setData] = useState<QuickViewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res: any = await https.get(`/api/dashboard/v0/quick-view`, {
          endTime: "1798736399999",
          serviceId: "VP",
          startTime: "1767200400000",

        });
        if (res?.data) {
          setData(res.data);
        }
      } catch {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section className="w-full space-y-3 bg-background rounded-3xl p-3 shadow-lg border border-border">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Tổng quan tài chính
        </h2>
        <p className="text-xs text-muted-foreground">Cập nhật theo kỳ</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading ? (
          <QuickViewSkeleton />
        ) : (
          data.map((item) => <QuickViewCard key={item.ItemId} item={item} />)
        )}
      </div>
    </section>
  );
}
