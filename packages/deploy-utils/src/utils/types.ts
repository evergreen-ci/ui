export type Target = "staging" | "beta" | "production";

export const isTarget = (t: string): t is Target =>
  t === "staging" || t === "beta" || t === "production";

export type DeployableApp = "parsley" | "spruce";

export const isDeployableApp = (a: string): a is DeployableApp =>
  a === "parsley" || a === "spruce";
