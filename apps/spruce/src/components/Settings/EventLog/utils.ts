import { CustomKeyValueRenderConfig } from "./types";

export const applyCustomKeyValueRender = (
  key: string,
  value: string,
  customRenderConfig: CustomKeyValueRenderConfig,
): string | React.ReactElement => {
  const prefixes = Object.keys(customRenderConfig);
  const prefix = prefixes.find((prefixKey) => key.startsWith(prefixKey));

  if (prefix) {
    return customRenderConfig[prefix](value);
  }
  return value;
};
