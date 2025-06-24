import { createSerializer } from "@emotion/jest";

const serializer = createSerializer({
  classNameReplacer(className, index) {
    if (className.startsWith("leafygreen-ui")) {
      return `leafygreen-ui-${index}`;
    }
    return `emotion-${index}`;
  },
  includeStyles: false,
});

export default serializer;
