import { ComponentType } from "react";
import { StoryObj, Meta } from "@storybook/react-vite";
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
  mocks: ApolloMock<unknown, unknown>[];
};

type CustomStorybookParams = {
  reactRouter?: CustomStorybookReactRouterParams;
  apolloClient?: CustomStorybookMockApolloProviderParams;
};

type ComponentProps<T> = T extends ComponentType<infer P> ? P : T;

type CustomStoryObj<T> = StoryObj<ComponentProps<T>> & {
  parameters?: CustomStorybookParams;
};

type CustomMeta<T> = Omit<Meta<ComponentProps<T>>, "component"> & {
  component?: ComponentType<any>;
  parameters?: CustomStorybookParams;
};

export type { CustomStoryObj, CustomMeta };
