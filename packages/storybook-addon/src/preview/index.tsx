import { MockedProvider } from "@apollo/client/testing";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { Decorator, Parameters, Preview } from "@storybook/react-vite";
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
  (Story) => (
    <LeafyGreenProvider>
      <Story />
    </LeafyGreenProvider>
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

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
