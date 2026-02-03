import { palette } from "@leafygreen-ui/palette";
import { Icon } from "@evg-ui/lib/components";
import { SectionStatus } from "constants/logs";

const { gray, red } = palette;

interface Props {
  status: SectionStatus;
}

export const SectionStatusIcon: React.FC<Props> = ({ status }) => {
  const fill = status === SectionStatus.Pass ? gray.dark1 : red.base;
  const glyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";
  return (
    <Icon data-cy={`section-status-${status}`} fill={fill} glyph={glyph} />
  );
};
