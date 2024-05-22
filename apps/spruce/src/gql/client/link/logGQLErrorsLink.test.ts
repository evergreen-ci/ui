import { GraphQLError } from "graphql";
import * as ErrorReporting from "utils/errorReporting";
import { reportingFn } from "./logGQLErrorsLink";

describe("reportingFn", () => {
  beforeEach(() => {
    vi.spyOn(ErrorReporting, "reportError");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("reportError should be called with secret fields redacted", () => {
    const secretFields = ["password", "creditCard"];
    const operation = {
      operationName: "exampleOperation",
      variables: {
        input: { password: "password123", creditCard: "1234567890123456" },
      },
      query: null,
      setContext: vi.fn(),
      getContext: vi.fn(),
      extensions: {},
    };
    const gqlErr = new GraphQLError("An error occurred", {
      path: ["a", "path", "1"],
    });

    // @ts-ignore: FIXME. This comment was added by an automated script.
    reportingFn(secretFields, operation)(gqlErr);

    expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
    expect(ErrorReporting.reportError).toHaveBeenCalledWith(expect.any(Error), {
      fingerprint: ["exampleOperation", "a", "path", "1"],
      tags: { operationName: "exampleOperation" },
      context: {
        gqlErr,
        variables: { input: { password: "REDACTED", creditCard: "REDACTED" } },
      },
    });
  });
});
