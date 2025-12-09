import { createContext } from "react";

export type Chip = {
  content: string;
  identifier: string;
  label: string;
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
