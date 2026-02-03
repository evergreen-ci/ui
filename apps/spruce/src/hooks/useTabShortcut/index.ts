import { CharKey } from "@evg-ui/lib/constants";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks";

interface Props {
  setSelectedTab: (n: number) => void;
  currentTab: number;
  numTabs: number;
}

/**
 * `useTabShortcut` is a hook that allows users to navigate between tabs using the `j` and `k` keys.
 * @param param0 - An object containing the current tab index, the number of tabs, and a function to set the selected tab.
 * @param param0.currentTab - The current tab index.
 * @param param0.numTabs - The number of tabs.
 * @param param0.setSelectedTab - A function to set the selected tab.
 */
export const useTabShortcut = ({
  currentTab,
  numTabs,
  setSelectedTab,
}: Props) => {
  useKeyboardShortcut({ charKey: CharKey.J }, () => {
    const nextTab = currentTab + 1 < numTabs ? currentTab + 1 : 0;
    setSelectedTab(nextTab);
  });

  useKeyboardShortcut({ charKey: CharKey.K }, () => {
    const previousTab = currentTab - 1 >= 0 ? currentTab - 1 : numTabs - 1;
    setSelectedTab(previousTab);
  });
};
