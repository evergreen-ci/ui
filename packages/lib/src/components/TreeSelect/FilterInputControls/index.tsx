import { Button, ButtonVariant } from "@via-ds/components/button";
import { Size } from "@via-ds/components/types";
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
      <Button onPress={onClickReset} size={Size.Small}>
        Reset
      </Button>
    </div>
    <Button
      onPress={onClickSubmit}
      size={Size.Small}
      variant={ButtonVariant.Primary}
    >
      {submitButtonCopy}
    </Button>
  </div>
);
