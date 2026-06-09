import { dashboardApi } from "@/services/dashboard.api";
import { useQuery } from "@tanstack/react-query";

export const useDashboardQuickViewQuery = (params?: any) => {
  return useQuery({
    queryKey: ["dashboard-quick-view", params],
    queryFn: () => dashboardApi.getQuickView(params),
  });
};
export const useDashboardStatisticInvoiceQuery = (params?: any) => {
  return useQuery({
    queryKey: ["dashboard-statistic-invoice", params],
    queryFn: () => dashboardApi.getViewStatisticInvoice(params),
    select: (data) => {
      if (Array.isArray(data) && !!data.length) return data[0];
    },
  });
};
export const useDashboardViewChartDtQuery = (params?: any) => {
  return useQuery({
    queryKey: ["dashboard-view-chart-dt", params],
    queryFn: () => dashboardApi.getViewChartDt(params),
    select: (data) => {
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
        (a, b) => parseInt(a.month.slice(1)) - parseInt(b.month.slice(1)),
      );
    },
  });
};
export const useDashboardChartTopQuery = (params?: any) => {
  return useQuery({
    queryKey: ["dashboard-chart-top", params],
    queryFn: () => dashboardApi.getViewChartTop(params),
  });
};

export const useDashboardViewInvoicesQuery = (params?: any) => {
  return useQuery({
    queryKey: ["dashboard-view-invoices", params],
    queryFn: () => dashboardApi.getViewInvoices(params),
  });
};
