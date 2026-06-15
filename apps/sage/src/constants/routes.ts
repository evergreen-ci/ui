enum slugs {
  agentId = "agentId",
  runId = "runId",
}

const paths = {
  agents: "agents",
  runs: "runs",
};

export const routes = {
  home: "/",
  agentDetail: `/${paths.agents}/:${slugs.agentId}`,
  agentRuns: `/${paths.agents}/:${slugs.agentId}/${paths.runs}/:${slugs.runId}`,
  notFound: "*",
};

export const routeConfig = {
  ...routes,
};

export const getAgentDetailRoute = (agentId: string) =>
  `/${paths.agents}/${agentId}`;

export const getAgentRunsRoute = (agentId: string, runId: string) =>
  `/${paths.agents}/${agentId}/${paths.runs}/${runId}`;
