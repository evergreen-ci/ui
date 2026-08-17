import { createElement, useEffect } from "react";
import { MockLink } from "@apollo/client/testing";
import {
  MockedProvider,
  MockedProviderProps,
} from "@apollo/client/testing/react";
import {
  type RenderOptions,
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

interface RenderWithRouterMatchOptions extends RenderOptions {
  route?: string;
  history?: unknown;
  path?: string;
}

/**
 * `renderWithRouterMatch` implements the `customRender` method and wraps a component
 * with an instance of `react-router`'s `<Router />` component.
 * @param ui - React Component to render
 * @param options - Options to pass to render
 * @returns RenderResult with custom queries bound to screen
 */
const renderWithRouterMatch = (
  ui: React.ReactElement,
  options: RenderWithRouterMatchOptions = {},
) => {
  const { path = "/", route = "/", wrapper: TestWrapper, ...rest } = options;

  const getMemoryRouter = (element: React.ReactElement) => {
    const routes = [
      {
        element: TestWrapper ? <TestWrapper>{element}</TestWrapper> : element,
        errorElement: <div>Failed to render component.</div>,
        path,
      },
      {
        element: <div>Not found</div>,
        path: "*",
      },
    ];
    return createMemoryRouter(routes, {
      initialEntries: [route],
    });
  };

  const memoryRouter = getMemoryRouter(ui);

  const { rerender, ...renderRest } = render(
    <RouterProvider router={memoryRouter} />,
    {
      ...rest,
    },
  );

  const customRerender = (element: React.ReactElement) => {
    rerender(<RouterProvider router={getMemoryRouter(element)} />);
  };

  return {
    rerender: customRerender,
    router: memoryRouter,
    ...renderRest,
  };
};

/**
 * `renderComponentWithHook` is a utility function that renders a component with a given hook for use in testing
 * @param useHook - The hook to use
 * @param Comp - The component to render
 * @returns - The component and the hook result accessible via hook.current
 */
const renderComponentWithHook = <
  T extends () => unknown,
  U extends React.JSX.Element | null,
>(
  useHook: T,
  Comp: U,
) => {
  const hookRef: { current?: ReturnType<T> } = { current: undefined };

  const TestComponent = () => {
    const hookResult = useHook();
    useEffect(() => {
      hookRef.current = hookResult as ReturnType<T>;
    });
    return Comp;
  };

  return {
    Component: TestComponent,
    hook: hookRef as { current: ReturnType<T> },
  };
};

/**
 * `stubGetClientRects` fixes a fallbackFocus error introduced by focus-trap.
 * focus-trap only offers legacy CommonJS exports so it can't be mocked by Vitest.
 * Instead, spoof focus-trap into thinking there is a node attached.
 * https://stackoverflow.com/a/75527964
 */
const stubGetClientRects = () => {
  const { getClientRects } = HTMLElement.prototype;
  HTMLElement.prototype.getClientRects = function () {
    return {
      ...getClientRects.apply(this),
      length: 1,
    };
  };
};

/**
 * createWrapper provides a generic way to pass props to a React Component wrapper.
 * @param Wrapper - Wrapper component
 * @param props - props to be spread on wrapper
 * @returns - wrapper with props applied
 */
const createWrapper = <T extends Record<string, unknown>>(
  Wrapper: React.ComponentType<React.PropsWithChildren<T>>,
  props: T,
) =>
  function CreatedWrapper({ children }: React.PropsWithChildren) {
    return createElement(Wrapper, props, children);
  };

type MockedResponse = MockLink.MockedResponse;

export {
  act,
  fireEvent,
  render,
  renderHook,
  renderWithRouterMatch,
  renderComponentWithHook,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  stubGetClientRects,
  createWrapper,
  MockedProvider,
  type MockedResponse,
  type MockedProviderProps,
};

export type { RenderWithRouterMatchOptions };
