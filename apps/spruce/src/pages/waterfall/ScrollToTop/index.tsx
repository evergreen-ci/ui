import { Button } from "@via-ds/components";
import ArrowUp from "@via-ds/icons/ArrowUp";
import { useMatch } from "react-router-dom";
import { routes } from "constants/routes";
import { waterfallPageContainerId } from "../constants";
import styles from "./index.module.css";

export const WaterfallScrollToTop: React.FC = () => {
  const isWaterfallPage = !!useMatch(`${routes.waterfall}/*`);

  return isWaterfallPage ? (
    <Button
      aria-label="Scroll to top"
      className={styles.button}
      onPress={() =>
        document.getElementById(waterfallPageContainerId)?.scrollTo({ top: 0 })
      }
      variant="tertiary"
    >
      <ArrowUp />
    </Button>
  ) : null;
};
