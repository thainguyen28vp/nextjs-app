import { auth } from "@/auth";
import { QuickView } from "@/features/dashboard/components/QuickView";
import { ViewStatisticInvoice } from "@/features/dashboard/components/ViewStatisticInvoice";
import { ViewChartTop } from "@/features/dashboard/components/ViewChartTop";
import RevenueBarChart from "@/features/dashboard/components/ChartTop";
import ChartDT from "@/features/dashboard/components/ChartDT";

export default async function DashboardPage() {
  return (
    // <div className="min-h-screen p-4">
    //   <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
    //     <QuickView />
    //     <ViewStatisticInvoice />
    //   </div>
    //   {/* <ViewChartTop />
    // <RevenueBarChart />
    // <ChartDT /> */}
    // </div>
    <div className="p-6 flex flex-col gap-6">
      <div className=" flex flex-wrap gap-4">
        <div className="flex-2 min-w-[500px]">
          <QuickView />
        </div>

        <div className="flex-1 min-w-[300px] h-fit">
          <ViewStatisticInvoice />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueBarChart />
        <ChartDT />
      </div>
      <ViewChartTop />
    </div>
  );
}
