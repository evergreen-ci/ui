import { createContext } from "react";
import { RichLinkVariantName } from "@lg-chat/rich-links";

export type ContextChip = {
  content: string;
  identifier: string;
  label: string;
  onClick?: () => void;
  badgeColor?: string; // The types aren't exported from LG
  badgeVariant?: RichLinkVariantName;
};

type ChatContextState = {
  appName: string;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chips: ContextChip[];
  toggleChip: (chip: ContextChip) => void;
  clearChips: () => void;
  setChipsForMessage: (message: string, chips: ContextChip[]) => void;
  getChipsForMessage: (message: string) => ContextChip[];
};

export const ChatContext = createContext<ChatContextState>({
  appName: "",
  drawerOpen: false,
  setDrawerOpen: () => {},
  chips: [],
  toggleChip: () => {},
  clearChips: () => {},
  setChipsForMessage: () => {},
  getChipsForMessage: () => [],
});
