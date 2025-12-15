import { createContext } from "react";
import { RichLinkVariantName } from "@lg-chat/rich-links";

export type ContextChip = {
  children: string;
  identifier: string;
  badgeLabel: string;
  badgeColor?: string; // types aren't exported from LG
  variant?: RichLinkVariantName;
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
