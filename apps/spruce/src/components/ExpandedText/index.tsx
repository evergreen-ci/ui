import {
  InlineDefinition,
  InlineDefinitionProps,
} from "@via-ds/components/inline-definition";
import { Tooltip } from "@via-ds/components/tooltip";
import { Disclaimer } from "@via-ds/components/typography";
import styles from "./index.module.css";

type ExpandedTextProps = {
  message: string;
} & Omit<InlineDefinitionProps, "children">;

const ExpandedText: React.FC<ExpandedTextProps> = ({ message, ...rest }) => (
  <InlineDefinition {...rest}>
    <Disclaimer className={styles.buttonText}>more</Disclaimer>
    <Tooltip>{message}</Tooltip>
  </InlineDefinition>
);

export default ExpandedText;
