import { ApolloLink } from "@apollo/client";
import * as ErrorReporting from "@evg-ui/lib/utils";
import { leaveBreadcrumbMapFn } from "./logGQLToSentryLink";

describe("leaveBreadcrumbLinkMapFn", () => {
  beforeEach(() => {
    vi.spyOn(ErrorReporting, "leaveBreadcrumb");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("leaveBreadcrumb function uses a list of secret fields to filter GQL req variables", () => {
    const assertLeaveBreadcrumbParams = (
      secretFields: string[],
      unfilteredVariables: ApolloLink.Operation["variables"],
      filteredVariables: ApolloLink.Operation["variables"],
    ) => {
      const operation = {
        operationName: "TestOperation",
        extensions: {},
        query: null,
        setContext: vi.fn(),
        getContext: vi.fn(),
      };
      const response = { data: { result: "Success" }, errors: null };

      const mappedFn = leaveBreadcrumbMapFn(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        { variables: unfilteredVariables, ...operation },
        secretFields,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
      )(response);

      expect(mappedFn).toStrictEqual(response);

      expect(ErrorReporting.leaveBreadcrumb).toHaveBeenLastCalledWith(
        "Graphql Request",
        {
          operationName: operation.operationName,
          variables: filteredVariables,
          status: "OK",
          errors: null,
        },
        ErrorReporting.SentryBreadcrumbTypes.HTTP,
      );
    };

    const variables = { id: 1, name: "test" };
    assertLeaveBreadcrumbParams(["id"], variables, {
      id: "REDACTED",
      name: "test",
    });
    assertLeaveBreadcrumbParams([], variables, variables);
    assertLeaveBreadcrumbParams(["na"], variables, variables);
    assertLeaveBreadcrumbParams(Object.keys(variables), variables, {
      id: "REDACTED",
      name: "REDACTED",
    });
  });
});
