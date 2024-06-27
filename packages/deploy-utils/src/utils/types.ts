export type Target = "staging" | "beta" | "production";

/**
 * isTarget asserts that a given string represents a deploy target
 * @param t - string to assert
 * @returns - typeguard for Target type
 */
export const isTarget = (t: string): t is Target =>
  t === "staging" || t === "beta" || t === "production";

export type DeployableApp = "parsley" | "spruce";

/**
 * isDeployable app asserts that a given string represents a deployable app
 * @param a - string to assert
 * @returns - typeguard for DeployableApp type
 */
export const isDeployableApp = (a: string): a is DeployableApp =>
  a === "parsley" || a === "spruce";
