import { Size, createIconComponent, glyphs } from "@leafygreen-ui/icon";
import AnimatedIcon from "./AnimatedIcon";
import * as icons from "./icons";
import { FallLogo } from "./icons/logos/FallLogo";
import { PrideLogo } from "./icons/logos/PrideLogo";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export { glyphMap as glyphs, Size };
export default createIconComponent(glyphMap);
export { AnimatedIcon, PrideLogo, FallLogo };
