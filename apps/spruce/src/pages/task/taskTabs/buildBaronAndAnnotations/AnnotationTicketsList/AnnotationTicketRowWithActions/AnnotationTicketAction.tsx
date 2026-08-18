import { Button, Size } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Icon, { IconProps } from "@evg-ui/lib/components/Icon";
import Popconfirm, { Align } from "@evg-ui/lib/components/Popconfirm";

interface AnnotationTicketActionProps {
  confirmMessage: string;
  "data-testid": string;
  iconGlyph: IconProps["glyph"];
  onConfirm: () => void;
  userCanModify: boolean;
}

export const AnnotationTicketAction: React.FC<AnnotationTicketActionProps> = ({
  confirmMessage,
  "data-testid": dataTestId,
  iconGlyph,
  onConfirm,
  userCanModify,
}) =>
  userCanModify ? (
    <Popconfirm
      align={Align.Right}
      onConfirm={onConfirm}
      trigger={
        <Button
          data-testid={dataTestId}
          leftGlyph={<Icon glyph={iconGlyph} />}
          size={Size.Small}
        />
      }
    >
      {confirmMessage}
    </Popconfirm>
  ) : (
    <Tooltip
      trigger={
        <Button
          data-testid={dataTestId}
          disabled
          leftGlyph={<Icon glyph={iconGlyph} />}
          size={Size.Small}
        />
      }
    >
      You are not authorized to edit failure details.
    </Tooltip>
  );
