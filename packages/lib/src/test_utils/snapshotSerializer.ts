import { createSerializer } from "@emotion/jest";

const serializer = createSerializer({
  classNameReplacer(className, index) {
    if (className.startsWith("css")) {
      const hashEnd = className.indexOf("-", "css".length + 1);
      const newClassName =
        hashEnd > 0
          ? `emotion${className.substring(hashEnd)}`
          : `emotion-${index}`;
      return newClassName.trim();
    }
    return className;
  },
  includeStyles: true,
});

export default serializer;
