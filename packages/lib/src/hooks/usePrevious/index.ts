import { useEffect, useReducer } from "react";

interface State<T> {
  current: T;
  previous: T | undefined;
}

type Action<T> = {
  type: "UPDATE";
  payload: T;
};

/**
 * Reducer function to manage previous and current state values
 * @param state - The current state containing current and previous values
 * @param action - The action to dispatch with new payload
 * @returns Updated state with new current value and previous value preserved
 */
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  if (action.type === "UPDATE" && action.payload !== state.current) {
    return {
      current: action.payload,
      previous: state.current,
    };
  }
  return state;
}

export const usePrevious = <T>(state: T): T | undefined => {
  const [{ previous }, dispatch] = useReducer(reducer<T>, {
    current: state,
    previous: undefined,
  });

  useEffect(() => {
    dispatch({ payload: state, type: "UPDATE" });
  }, [state]);

  return previous;
};
