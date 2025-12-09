import { createContext } from "react";

export type Chip = {
  startLine: number;
  endLine?: number;
  content: string;
};

type ChatContextState = {
  appName: string;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chips: Chip[];
  toggleChip: (chip: Chip) => void;
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
