import { CustomKeyRenderConfig } from "./types";

export const applyCustomKeyRender = (
  key: string,
  customRenderConfig: CustomKeyRenderConfig,
): string | React.ReactNode => {
  const prefixes = Object.keys(customRenderConfig);
  const prefix = prefixes.find((prefixKey) => key.startsWith(prefixKey));

  if (prefix) {
    return customRenderConfig[prefix](key);
  }
  return key;
};
