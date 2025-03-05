import { Size, createIconComponent, glyphs } from "@leafygreen-ui/icon";
import AnimatedIcon from "./AnimatedIcon";
import { HolidayTree } from "./AnimatedIcon/HolidayTree";
import * as icons from "./icons";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export { glyphMap as glyphs, Size };
export default createIconComponent(glyphMap);
export { HolidayTree, AnimatedIcon };
