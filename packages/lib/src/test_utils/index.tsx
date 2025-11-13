import { useEffect, createElement } from "react";
import {
  act,
  fireEvent,
  queries,
  render,
  renderHook,
  screen,
  waitFor,
  within,
  waitForElementToBeRemoved,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import * as customQueries from "./custom-queries";

type QueriesType = typeof queries;
type CustomQueriesType = typeof customQueries;
type CustomRenderType = CustomQueriesType & QueriesType;
type CustomRenderOptions = RenderOptions<CustomRenderType>;

interface RenderWithRouterMatchOptions extends CustomRenderOptions {
  route?: string;
  history?: unknown;
  path?: string;
}

// Bind our custom queries to screen.
// https://github.com/testing-library/dom-testing-library/issues/516
const boundQueries = within<typeof customQueries>(document.body, customQueries);
const customScreen = { ...screen, ...boundQueries };

/**
 * `customRender` or `render` takes an instance of react-testing-library's render method
 *  and adds additional selectors for querying components in tests.
 * @param ui - React Component to render
 * @param options - Options to pass to render
 * @returns RenderResult with custom queries bound to screen
 */
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    ...options,
  }) as RenderResult<CustomRenderType>;

const customWithin = (ui: HTMLElement) =>
  within(ui, { ...queries, ...customQueries });

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

  const { rerender, ...renderRest } = customRender(
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
  U extends JSX.Element | null,
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

export {
  act,
  fireEvent,
  customRender as render,
  renderHook,
  renderWithRouterMatch,
  renderComponentWithHook,
  customScreen as screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  customWithin as within,
  stubGetClientRects,
  createWrapper,
};

export type { RenderWithRouterMatchOptions };
