type RouteMatchConfig = {
  routeConfig: RouteConfig;
};
type RouteConfig = {
  [name: string]: string;
};

export type { RouteConfig, RouteMatchConfig };
