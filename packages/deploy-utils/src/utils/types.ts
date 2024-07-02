export type TargetEnvironment = "staging" | "beta" | "production";

/**
 * isTargetEnvironment asserts that a given string represents a deploy target
 * @param t - string to assert
 * @returns - typeguard for Target type
 */
export const isTargetEnvironment = (
  t: string | undefined,
): t is TargetEnvironment =>
  t === "staging" || t === "beta" || t === "production";

export type DeployableApp = "parsley" | "spruce";

/**
 * isDeployable app asserts that a given string represents a deployable app
 * @param a - string to assert
 * @returns - typeguard for DeployableApp type
 */
export const isDeployableApp = (a: string): a is DeployableApp =>
  a === "parsley" || a === "spruce";
