import createEmotion from "@emotion/css/create-instance";

/**
 * createEmotionInstance is a shim to prevent LG's emotion package from pulling in SSR dependencies.
 * https://jira.mongodb.org/browse/EVG-17077
 * @returns - instance of createEmotion without SSR dependencies
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
