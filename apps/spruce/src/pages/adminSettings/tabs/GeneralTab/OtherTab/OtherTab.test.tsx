import { validate } from "./OtherTab";
import { OtherFormState } from "./types";

const validateGitHubRecoveryApp = (
  githubRecoveryApp: OtherFormState["other"]["githubRecoveryApp"],
) => {
  const addPrivateKeyError = vi.fn();
  const errors = {
    other: {
      githubRecoveryApp: {
        privateKey: { addError: addPrivateKeyError },
      },
    },
  };

  validate(
    { other: { githubRecoveryApp } } as OtherFormState,
    errors as unknown as Parameters<typeof validate>[1],
  );

  return addPrivateKeyError;
};

describe("other tab validation", () => {
  it("allows the GitHub recovery app to be unset", () => {
    expect(
      validateGitHubRecoveryApp({ appId: null, privateKey: "" }),
    ).not.toHaveBeenCalled();
  });

  it("allows an app ID with a private key", () => {
    expect(
      validateGitHubRecoveryApp({ appId: 1234, privateKey: "key" }),
    ).not.toHaveBeenCalled();
  });

  it("errors when an app ID has no private key", () => {
    expect(
      validateGitHubRecoveryApp({ appId: 1234, privateKey: "" }),
    ).toHaveBeenCalledOnce();
  });
});
