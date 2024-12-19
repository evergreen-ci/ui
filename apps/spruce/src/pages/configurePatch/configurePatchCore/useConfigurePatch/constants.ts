import { ConfigurePatchPageTabs } from "types/patch";

const indexToTabMap = [
  ConfigurePatchPageTabs.Tasks,
  ConfigurePatchPageTabs.Changes,
  ConfigurePatchPageTabs.Parameters,
];

const tabToIndexMap = {
  [ConfigurePatchPageTabs.Tasks]: 0,
  [ConfigurePatchPageTabs.Changes]: 1,
  [ConfigurePatchPageTabs.Parameters]: 2,
};
export { indexToTabMap, tabToIndexMap };
