import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { Decorator, Parameters } from "@storybook/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { GlobalStyles } from "../src/components/styles";
import { LogContextProvider } from "../src/context/LogContext";
import WithToastContext from "../src/test_utils/toast-decorator";

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    // This workaround is required for storyshots (https://github.com/lifeiscontent/storybook-addon-apollo-client/issues/16).
    MockedProvider: ({ children }: { children: React.ReactNode }) => children,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
  (Story: () => JSX.Element) => (
    <LogContextProvider>
      <Story />
    </LogContextProvider>
  ),
  (
    Story,
    {
      parameters: {
        apolloClient: { MockedProvider: _, ...rest },
      },
    },
  ) => (
    <MockedProvider {...rest}>
      <Story />
    </MockedProvider>
  ),
  WithToastContext,
  (Story: () => JSX.Element) => {
    const routes = [
      {
        path: "/",
        element: <Story />,
        errorElement: <div>Failed to render component.</div>,
      },
    ];
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    return <RouterProvider router={memoryRouter} />;
  },
];
