import { ConfigurePatchPageTabs } from "types/patch";

const indexToTabMap = [
  ConfigurePatchPageTabs.Tasks,
  ConfigurePatchPageTabs.Changes,
  ConfigurePatchPageTabs.Parameters,
];

const tabToIndexMap = {
  [ConfigurePatchPageTabs.Changes]: 1,
  [ConfigurePatchPageTabs.Parameters]: 2,
  [ConfigurePatchPageTabs.Tasks]: 0,
};
export { indexToTabMap, tabToIndexMap };
