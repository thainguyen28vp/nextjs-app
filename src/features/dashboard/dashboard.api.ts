import httpClient from "../../lib/api";

export const dashboardApi = {
  getQuickView: async (params: any) => {
    const response = await httpClient.get("api/dashboard/quick-view", params);
    return response.data;
  },
  getViewStatisticInvoice: async (params: any) => {
    const response = await httpClient.get(
      "api/dashboard/view-statistic-invoice",
      params,
    );
    return response.data;
  },
  getViewChartDt: async (params: any) => {
    const response = await httpClient.get(
      "api/dashboard/view-chart-dt",
      params,
    );
    return response.data;
  },
  getViewChartTop: async (params: any) => {
    const response = await httpClient.get(
      "api/dashboard/view-chart-top",
      params,
    );
    return response.data;
  },
  getViewInvoices: async (params: any) => {
    const response = await httpClient.get("api/dashboard/view-invoice", params);
    return response.data;
  },
};
