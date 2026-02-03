import { Button, Size } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Icon, Align, Popconfirm } from "@evg-ui/lib/components";

interface AnnotationTicketActionProps {
  confirmMessage: string;
  "data-cy": string;
  iconGlyph: string;
  onConfirm: () => void;
  userCanModify: boolean;
}

export const AnnotationTicketAction: React.FC<AnnotationTicketActionProps> = ({
  confirmMessage,
  "data-cy": dataCy,
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
          data-cy={dataCy}
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
          data-cy={dataCy}
          disabled
          leftGlyph={<Icon glyph={iconGlyph} />}
          size={Size.Small}
        />
      }
    >
      You are not authorized to edit failure details.
    </Tooltip>
  );
