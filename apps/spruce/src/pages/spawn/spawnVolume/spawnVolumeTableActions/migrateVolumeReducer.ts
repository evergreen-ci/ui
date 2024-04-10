import { FormState } from "components/Spawn/spawnHostModal";

export enum Page {
  First,
  Second,
}

interface State {
  hasError: boolean;
  page: Page;
  form: FormState;
}

export const initialState = { page: Page.First, form: {}, hasError: true };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "goToNextPage":
      return {
        ...state,
        page: state.page === Page.First ? Page.Second : Page.First,
      };
    case "resetPage":
      return { ...state, page: Page.First };
    case "setForm":
      return { ...state, form: action.payload };
    case "setHasError":
      return { ...state, hasError: action.payload };
    case "resetForm":
      return { ...state, form: {} };
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

type Action =
  | { type: "goToNextPage" }
  | { type: "resetForm" }
  | { type: "resetPage" }
  | { type: "setHasError"; payload: boolean }
  | { type: "setForm"; payload: FormState };
