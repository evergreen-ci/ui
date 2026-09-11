import { Button } from "@via-ds/components";
import { useMatch } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { routes } from "constants/routes";
import { waterfallPageContainerId } from "../constants";

export const WaterfallScrollToTop: React.FC = () => {
  const isWaterfallPage = !!useMatch(`${routes.waterfall}/*`);

  return isWaterfallPage ? (
    <Button
      aria-label="Scroll to top"
      onPress={() =>
        document.getElementById(waterfallPageContainerId)?.scrollTo({ top: 0 })
      }
      size="small"
      variant="tertiary"
    >
      <Icon glyph="ArrowUp" />
    </Button>
  ) : null;
};
