import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/**
 * `usePrevious` is a custom hook that returns the previous value of a given value
 * @param value - the value to track
 * @param initialValue - the initial value
 * @returns the previous value
 */
const usePrevious = <T>(value: T, initialValue: T) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * `useEffectDebugger` is a custom hook that logs the changed dependencies of a useEffect hook
 * @param effectHook - the effect hook
 * @param dependencies - an array of dependencies
 * @param dependencyNames - an array of strings that correspond to the dependencies
 */
const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = [],
) => {
  if (process.env.NODE_ENV !== "development") {
    console.warn(
      "[use-effect-debugger] This hook should only be used in development!",
    );
  }
  if (dependencies.length !== dependencyNames.length) {
    console.warn(
      "[use-effect-debugger] The number of dependencies and dependency names should be the same!",
    );
  }
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce(
    (accum: Record<string, { before: any; after: any }>, dependency, index) => {
      if (dependency !== previousDeps[index]) {
        const keyName = dependencyNames[index] || index;
        return {
          ...accum,
          [keyName]: {
            before: previousDeps[index],
            after: dependency,
          },
        };
      }

      return accum;
    },
    {} as Record<string, { before: any; after: any }>,
  );

  if (Object.keys(changedDeps).length) {
    console.log("[use-effect-debugger] ");
    console.table(changedDeps);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
};

/**
 * `renderComponentWithHook` is a utility function that renders a component with a given hook for use in testing
 * @param useHook - The hook to use
 * @param Comp - The component to render
 * @returns - The component and the hook
 */
const renderComponentWithHook = <
  T extends () => any,
  U extends JSX.Element | null,
>(
  useHook: T,
  Comp: U,
) => {
  const hook: { current: ReturnType<typeof useHook> } = {
    current: {} as ReturnType<typeof useHook>,
  };
  const Component = () => {
    hook.current = useHook();
    return Comp;
  };
  return {
    Component,
    hook,
  };
};

export { useEffectDebugger, renderComponentWithHook };
