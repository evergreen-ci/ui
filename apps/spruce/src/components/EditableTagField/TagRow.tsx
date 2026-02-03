import { useReducer, useMemo } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { TextArea } from "@leafygreen-ui/text-area";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { PlusButton } from "components/Buttons";
import { ParameterInput, InstanceTag } from "gql/generated/types";
import { reducer, getInitialState } from "./tagRowReducer";

type Tag = InstanceTag | ParameterInput;

interface TagRowProps {
  tag?: Tag;
  onDelete?: (key: string) => void;
  onUpdateTag?: (tag: Tag, deleteKey?: string) => void;
  isValidKey: (key: string) => boolean; // function to validate if a key has been duplicated
  isNewTag?: boolean;
  buttonText: string;
}
export const TagRow: React.FC<TagRowProps> = ({
  buttonText,
  isNewTag = false,
  isValidKey,
  onDelete,
  onUpdateTag,
  tag,
}) => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const [state, dispatch] = useReducer(reducer, getInitialState(tag, isNewTag));

  const tagId = useMemo(() => crypto.randomUUID(), []);
  const { canSave, isInputValid, key, shouldShowNewTag, value } = state;

  return (
    <>
      {shouldShowNewTag && (
        <FlexContainer data-cy="user-tag-row">
          <FlexColumnContainer>
            <TextArea
              data-cy="user-tag-key-field"
              id={`tag_key_${tagId}`}
              label="Key"
              onChange={(e) =>
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                dispatch({ type: "updateTag", key: e.target.value })
              }
              value={key}
            />
          </FlexColumnContainer>
          <FlexColumnContainer>
            <TextArea
              data-cy="user-tag-value-field"
              id={`tag_value_${tagId}`}
              label="Value"
              onChange={(e) =>
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                dispatch({ type: "updateTag", value: e.target.value })
              }
              value={value}
            />
          </FlexColumnContainer>
          {canSave ? (
            <IconButton
              aria-label="Update tag"
              disabled={
                !isInputValid ||
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                ((isNewTag || key !== tag.key) && !isValidKey(key))
              }
            >
              <Icon
                data-cy="user-tag-edit-icon"
                glyph="Checkmark"
                onClick={() => {
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  dispatch({
                    type: isNewTag ? "cancelNewTag" : "inActive",
                  });
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  onUpdateTag(
                    { key, value },
                    // @ts-expect-error: FIXME. This comment was added by an automated script.
                    !isNewTag && key !== tag.key ? tag.key : undefined,
                  );
                }}
              />
            </IconButton>
          ) : (
            <IconButton aria-label="Delete Tag">
              <Icon
                data-cy="user-tag-trash-icon"
                glyph="Trash"
                onClick={
                  isNewTag
                    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
                      () => dispatch({ type: "cancelNewTag" })
                    : // @ts-expect-error: FIXME. This comment was added by an automated script.
                      () => onDelete(tag.key)
                }
              />
            </IconButton>
          )}
        </FlexContainer>
      )}
      {!shouldShowNewTag && (
        <ButtonContainer>
          <PlusButton
            data-cy="add-tag-button"
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            onClick={() => dispatch({ type: "newTag" })}
          >
            {buttonText}
          </PlusButton>
        </ButtonContainer>
      )}
    </>
  );
};

const ButtonContainer = styled.div`
  margin-top: ${size.m};
`;
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${size.xs};
  margin-top: ${size.m};
  flex-grow: 1;
`;
