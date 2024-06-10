import type { ProjectAnnotations } from "@storybook/types";
import { MockedProvider } from "@apollo/client/testing";
import { Decorator, Parameters, ReactRenderer } from "@storybook/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider: ({ children }: { children: React.ReactNode }) => children,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const decorators: Decorator[] = [
  (
    Story,
    {
      parameters: {
        apolloClient: { MockedProvider: _, ...rest },
      },
    }
  ) => (
    <MockedProvider {...rest}>
      <Story />
    </MockedProvider>
  ),
  (Story, context) => {
    const { parameters: storyParameters } = context;
    const { reactRouter } = storyParameters;
    const { params, path, route } = reactRouter || {};
    const routes = [
      {
        path: path || "/",
        parameters: params || {},
        element: <Story />,
        errorElement: <div>Failed to render component.</div>,
      },
    ];
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: [route || "/"],
    });
    return <RouterProvider router={memoryRouter} />;
  },
];

const preview: ProjectAnnotations<ReactRenderer> = {
  parameters,
  decorators,
};

export default preview;
