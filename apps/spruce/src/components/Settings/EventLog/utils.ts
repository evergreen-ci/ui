import { CustomKeyValueRenderConfig } from "./types";

export const applyCustomKeyValueRender = (
  key: string,
  customRenderConfig: CustomKeyValueRenderConfig,
): string | React.ReactNode => {
  const prefixes = Object.keys(customRenderConfig);
  const prefix = prefixes.find((prefixKey) => key.startsWith(prefixKey));

  if (prefix) {
    return customRenderConfig[prefix](key);
  }
  return key;
};
