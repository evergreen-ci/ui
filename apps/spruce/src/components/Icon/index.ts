import { createIconComponent, glyphs, Size } from "@leafygreen-ui/icon";
import * as icons from "./icons";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export { glyphMap as glyphs, Size };
// @ts-ignore: FIXME. This comment was added by an automated script.
export default createIconComponent(glyphMap);
