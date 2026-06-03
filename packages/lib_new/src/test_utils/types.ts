import { ComponentType } from "react";
import { MockLink } from "@apollo/client/testing";
import { StoryObj, Meta } from "@storybook/react-vite";

type ApolloMock = MockLink.MockedResponse;

type CustomStorybookReactRouterParams = {
  initialEntries?: string[];
  path?: string;
  route?: string;
};
type CustomStorybookMockApolloProviderParams = {
  mocks: ApolloMock[];
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
  component?: ComponentType<T>;
  parameters?: CustomStorybookParams;
};

export type { CustomStoryObj, CustomMeta };
