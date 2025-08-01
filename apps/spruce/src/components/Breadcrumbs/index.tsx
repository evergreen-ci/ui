import { Fragment } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";

const { gray } = palette;

export interface Breadcrumb {
  text: string;
  to?: string;
  onClick?: () => void;
  "data-cy"?: string;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => (
  <Container>
    {breadcrumbs.map((bc, index) => (
      <Fragment key={`breadcrumb-${bc.text}`}>
        <BreadcrumbFragment breadcrumb={bc} />
        {breadcrumbs.length - 1 !== index && (
          <PaddedIcon
            data-cy="breadcrumb-chevron"
            fill={gray.dark2}
            glyph="ChevronRight"
            size="small"
          />
        )}
      </Fragment>
    ))}
  </Container>
);

interface BreadcrumbFragmentProps {
  breadcrumb: Breadcrumb;
}
const BreadcrumbFragment: React.FC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const { "data-cy": dataCy, onClick, text = "", to } = breadcrumb;
  const shouldTrimMessage = text.length > 30;
  const message = trimStringFromMiddle(text, 30);
  return (
    <Tooltip
      align="top"
      data-cy="breadcrumb-tooltip"
      enabled={shouldTrimMessage}
      justify="middle"
      popoverZIndex={zIndex.tooltip}
      trigger={
        to ? (
          <div data-cy={dataCy}>
            <StyledRouterLink onClick={onClick} to={to}>
              {message}
            </StyledRouterLink>
          </div>
        ) : (
          <div data-cy={dataCy}>{message}</div>
        )
      }
      triggerEvent="hover"
    >
      {text}
    </Tooltip>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: ${size.m};
`;

const PaddedIcon = styled(Icon)`
  margin: 0 ${size.xxs};
`;

export default Breadcrumbs;
