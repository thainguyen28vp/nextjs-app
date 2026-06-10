const ROUTES = {
  LOGIN: "/login",

  DASHBOARD: "/dashboard",

  USER: {
    LIST: "/dashboard/users",

    DETAIL: (id: string) => `/dashboard/users/${id}`,
  },
};

export default ROUTES;
