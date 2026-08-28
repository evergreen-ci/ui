import {
  InlineDefinition,
  InlineDefinitionProps,
} from "@leafygreen-ui/inline-definition";
import { Disclaimer } from "@leafygreen-ui/typography";
import styles from "./index.module.css";

type ExpandedTextProps = {
  message: string;
} & Omit<InlineDefinitionProps, "children" | "definition">;

const ExpandedText: React.FC<ExpandedTextProps> = ({ message, ...rest }) => (
  <InlineDefinition {...rest} definition={message}>
    <Disclaimer className={styles.buttonText}>more</Disclaimer>
  </InlineDefinition>
);

export default ExpandedText;
