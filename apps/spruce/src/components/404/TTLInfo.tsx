import { Body, Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { dataRetentionDocumentationUrl } from "constants/externalResources";
import styles from "./TTLInfo.module.css";

export const TTLInfo = ({ children }: React.PropsWithChildren) => (
  <>
    <div className={styles.speechBubble}>
      <Subtitle>Looking for something?</Subtitle>
      <Body>
        Versions and tasks expire after 365 days. More on Evergreen&rsquo;s data
        retention policy{" "}
        <StyledLink href={dataRetentionDocumentationUrl}>here</StyledLink>.
      </Body>
    </div>
    {children}
  </>
);
