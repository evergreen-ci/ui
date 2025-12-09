import { createContext } from "react";

export type SelectedLineRange = {
  startLine: number;
  endLine?: number;
  content: string;
};

type ChatContextState = {
  appName: string;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLineRanges: SelectedLineRange[];
  toggleSelectedLineRange: (range: SelectedLineRange) => void;
  clearSelectedLineRanges: () => void;
};

export const ChatContext = createContext<ChatContextState>({
  appName: "",
  drawerOpen: false,
  setDrawerOpen: () => {},
  selectedLineRanges: [],
  toggleSelectedLineRange: () => {},
  clearSelectedLineRanges: () => {},
});
