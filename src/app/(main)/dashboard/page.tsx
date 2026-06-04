import { auth } from "@/auth";
import { QuickView } from "@/features/dashboard/components/QuickView";
import { ViewStatisticInvoice } from "@/features/dashboard/components/ViewStatisticInvoice";
import { ViewChartTop } from "@/features/dashboard/components/ViewChartTop";
import RevenueBarChart from "@/features/dashboard/components/ChartTop";
import ChartDT from "@/features/dashboard/components/ChartDT";

export default async function DashboardPage() {
  return <div>
    <QuickView />
    <ViewStatisticInvoice />
    <ViewChartTop />
    <RevenueBarChart />
    <ChartDT />
  </div>;
}
