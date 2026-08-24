import {
  Button,
  Size as ButtonSize,
  Variant as ButtonVariant,
} from "@leafygreen-ui/button";
import styles from "./index.module.css";

interface Props {
  onClickReset: () => void;
  onClickSubmit: () => void;
  submitButtonCopy?: string;
}

export const FilterInputControls: React.FC<Props> = ({
  onClickReset,
  onClickSubmit,
  submitButtonCopy = "Filter",
}) => (
  <div className={styles.buttonsWrapper}>
    <div className={styles.buttonWrapper}>
      <Button onClick={onClickReset} size={ButtonSize.Small}>
        Reset
      </Button>
    </div>
    <Button
      onClick={onClickSubmit}
      size={ButtonSize.Small}
      variant={ButtonVariant.Primary}
    >
      {submitButtonCopy}
    </Button>
  </div>
);
