import createEmotion from "@emotion/css/create-instance";

/**
 * createEmotion instance uses a shim to prevent LG's emotion package (https://github.com/mongodb/leafygreen-ui/tree/main/packages/emotion)
 * from pulling in SSR dependencies. https://jira.mongodb.org/browse/EVG-17077
 * @returns Emotion instance compatible with LeafyGreen
 */
function createEmotionInstance() {
  const config = {
    key: "leafygreen-ui",
    prepend: true,
  };

  return createEmotion(config);
}

const instance = createEmotionInstance();

export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  cache,
} = instance;

// eslint-disable-next-line import/no-default-export
export default instance;
