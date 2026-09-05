import { useMemo, useReducer } from "react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { TextArea } from "@leafygreen-ui/text-area";
import Checkmark from "@via-ds/icons/Checkmark";
import Trash from "@via-ds/icons/Trash";
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
            <IconButton
              aria-label="Update tag"
              disabled={
                !isInputValid ||
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                ((isNewTag || key !== tag.key) && !isValidKey(key))
              }
            >
              <Checkmark
                data-testid="user-tag-edit-icon"
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
                size="medium"
              />
            </IconButton>
          ) : (
            <IconButton aria-label="Delete Tag">
              <Trash
                data-testid="user-tag-trash-icon"
                onClick={
                  isNewTag
                    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
                      () => dispatch({ type: "cancelNewTag" })
                    : // @ts-expect-error: FIXME. This comment was added by an automated script.
                      () => onDelete(tag.key)
                }
                size="medium"
              />
            </IconButton>
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
