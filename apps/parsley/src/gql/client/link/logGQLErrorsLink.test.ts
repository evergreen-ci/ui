import { ApolloLink } from "@apollo/client";
import { GraphQLError } from "graphql";
import * as ErrorReporting from "@evg-ui/lib/utils";
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
    const operation: ApolloLink.Operation = {
      extensions: {},
      getContext: vi.fn(),
      operationName: "exampleOperation",
      // @ts-expect-error: It's not necessary to run an actual query.
      query: null,
      setContext: vi.fn(),
      variables: {
        input: { creditCard: "1234567890123456", password: "password123" },
      },
    };
    const gqlErr = new GraphQLError("An error occurred", {
      path: ["a", "path", "1"],
    });

    reportingFn(secretFields, operation)(gqlErr);

    expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
    expect(ErrorReporting.reportError).toHaveBeenCalledWith(expect.any(Error), {
      context: {
        gqlErr,
        variables: { input: { creditCard: "REDACTED", password: "REDACTED" } },
      },
      fingerprint: ["exampleOperation", "a", "path", "1"],
      tags: { operationName: "exampleOperation" },
    });
  });
});
