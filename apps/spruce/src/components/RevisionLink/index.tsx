import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { shortenGithash } from "@evg-ui/lib/utils/string";

interface RevisionLinkProps {
  "data-testid"?: string;
  onClick?: () => void;
  revision: string;
  to: string;
}

export const RevisionLink: React.FC<RevisionLinkProps> = ({
  "data-testid": dataTestId,
  onClick,
  revision,
  to,
}) => (
  <InlineCode as={Link} data-testid={dataTestId} onClick={onClick} to={to}>
    {shortenGithash(revision)}
  </InlineCode>
);
