import { StoryObj, Meta } from "@storybook/react";
import { DocumentNode, GraphQLError } from "graphql";

/**
 * Mock for ApolloProvider this allows you to mock GraphQL queries in tests.
 */
export type ApolloMock<Data, Variables> = {
  request: {
    query: DocumentNode;
    variables?: Variables;
  };
  result?: {
    data?: Data;
    errors?: GraphQLError[];
  };
  error?: Error;
};

type CustomStorybookReactRouterParams = {
  initialEntries?: string[];
  path?: string;
  route?: string;
};
type CustomStorybookMockApolloProviderParams = {
  mocks: ApolloMock<any, any>[];
};

type CustomStorybookParams = {
  reactRouter?: CustomStorybookReactRouterParams;
  apolloClient?: CustomStorybookMockApolloProviderParams;
  storyshots?: {
    disable?: boolean;
  };
};

type CustomStoryObj<T extends any> = StoryObj<T> & {
  parameters?: CustomStorybookParams;
};

type CustomMeta<T extends any> = Meta<T> & {
  parameters?: CustomStorybookParams;
};

export type { CustomStoryObj, CustomMeta };
