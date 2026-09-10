import { useMemo, useReducer } from "react";
import { Button } from "@via-ds/components/button";
import { TextArea } from "@via-ds/components/text-area";
import Icon from "@evg-ui/lib/components/Icon";
import { PlusButton } from "components/Buttons";
import { InstanceTag, ParameterInput } from "gql/generated/types";
import styles from "./TagRow.module.css";
import { getInitialState, reducer } from "./tagRowReducer";

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
        <div className={styles.flexContainer} data-testid="user-tag-row">
          <div className={styles.flexColumnContainer}>
            <TextArea
              data-testid="user-tag-key-field"
              id={`tag_key_${tagId}`}
              label="Key"
              onChange={(e) =>
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                dispatch({ type: "updateTag", key: e.target.value })
              }
              value={key}
            />
          </div>
          <div className={styles.flexColumnContainer}>
            <TextArea
              data-testid="user-tag-value-field"
              id={`tag_value_${tagId}`}
              label="Value"
              onChange={(e) =>
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                dispatch({ type: "updateTag", value: e.target.value })
              }
              value={value}
            />
          </div>
          {canSave ? (
            <Button
              aria-label="Update tag"
              isDisabled={
                !isInputValid ||
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                ((isNewTag || key !== tag.key) && !isValidKey(key))
              }
              onPress={() => {
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
              variant="tertiary"
            >
              <Icon data-testid="user-tag-edit-icon" glyph="Checkmark" />
            </Button>
          ) : (
            <Button
              aria-label="Delete Tag"
              onPress={() =>
                isNewTag
                  ? // @ts-expect-error: FIXME. This comment was added by an automated script.
                    dispatch({ type: "cancelNewTag" })
                  : // @ts-expect-error: FIXME. This comment was added by an automated script.
                    onDelete(tag.key)
              }
              variant="tertiary"
            >
              <Icon data-testid="user-tag-trash-icon" glyph="Trash" />
            </Button>
          )}
        </div>
      )}
      {!shouldShowNewTag && (
        <div className={styles.buttonContainer}>
          <PlusButton
            data-testid="add-tag-button"
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            onClick={() => dispatch({ type: "newTag" })}
          >
            {buttonText}
          </PlusButton>
        </div>
      )}
    </>
  );
};
