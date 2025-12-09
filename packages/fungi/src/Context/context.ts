import { createContext } from "react";

export type ContextChip = {
  content: string;
  identifier: string;
  label: string;
};

type ChatContextState = {
  appName: string;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chips: ContextChip[];
  toggleChip: (chip: ContextChip) => void;
  clearChips: () => void;
};

export const ChatContext = createContext<ChatContextState>({
  appName: "",
  drawerOpen: false,
  setDrawerOpen: () => {},
  chips: [],
  toggleChip: () => {},
  clearChips: () => {},
});
