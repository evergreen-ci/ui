import { getAppToDeploy } from "./environment";

describe("getAppToDeploy", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns app name when PNPM_PACKAGE_NAME is spruce", () => {
    process.env.PNPM_PACKAGE_NAME = "spruce";
    expect(getAppToDeploy()).toEqual("spruce");
  });

  it("returns app name when PNPM_PACKAGE_NAME is parsley", () => {
    process.env.PNPM_PACKAGE_NAME = "parsley";
    expect(getAppToDeploy()).toEqual("parsley");
  });

  it("throws an error when PNPM_PACKAGE_NAME is not set", () => {
    delete process.env.PNPM_PACKAGE_NAME;
    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory using pnpm",
    );
  });

  it("throws an error when PNPM_PACKAGE_NAME is not a deployable app", () => {
    process.env.PNPM_PACKAGE_NAME = "some-other-package";
    expect(() => getAppToDeploy()).toThrowError(
      "Must deploy from an app's root directory using pnpm",
    );
  });
});
