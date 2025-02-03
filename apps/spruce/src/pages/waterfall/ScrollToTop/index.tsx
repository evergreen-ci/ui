import IconButton from "@leafygreen-ui/icon-button";
import { useMatch } from "react-router-dom";
import Icon from "components/Icon";
import { routes } from "constants/routes";
import { waterfallPageContainerId } from "../constants";

export const WaterfallScrollToTop: React.FC = () => {
  const isWaterfallPage = !!useMatch(`${routes.waterfall}/*`);

  return isWaterfallPage ? (
    <IconButton
      aria-label="Scroll to top"
      onClick={() =>
        document.getElementById(waterfallPageContainerId)?.scrollTo({ top: 0 })
      }
    >
      <Icon glyph="ArrowUp" />
    </IconButton>
  ) : null;
};
