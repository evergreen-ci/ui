import { IconButton } from "@leafygreen-ui/icon-button";
import ArrowUp from "@via-ds/icons/ArrowUp";
import { useMatch } from "react-router-dom";
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
      <ArrowUp size="medium" />
    </IconButton>
  ) : null;
};
