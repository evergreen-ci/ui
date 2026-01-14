import { createContext } from "react";
import { RichLinkVariantName } from "@lg-chat/rich-links";

export type ContextChip = {
  content: string;
  identifier: string;
  badgeLabel: string;
  badgeColor?: string; // The types aren't exported from LG
  badgeVariant?: RichLinkVariantName;
  metadata?: Record<string, unknown>;
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
