import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { TextArea } from "@leafygreen-ui/text-area";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useAnnotationAnalytics } from "analytics";
import {
  EditAnnotationNoteMutation,
  EditAnnotationNoteMutationVariables,
  Note,
} from "gql/generated/types";
import { EDIT_ANNOTATION_NOTE } from "gql/mutations";
import { useDateFormat } from "hooks";
import { ButtonWrapper } from "./BBComponents";

interface Props {
  note: Note;
  taskId: string;
  execution: number;
  userCanModify: boolean;
}

const AnnotationNote: React.FC<Props> = ({
  execution,
  note,
  taskId,
  userCanModify,
}) => {
  const getDateCopy = useDateFormat();
  const annotationAnalytics = useAnnotationAnalytics();
  const originalMessage = note?.message || "";
  const dispatchToast = useToastContext();
  const [newMessage, setMessage] = useState(originalMessage);
  useEffect(() => {
    setMessage(originalMessage);
  }, [originalMessage]);

  const [updateAnnotationNote] = useMutation<
    EditAnnotationNoteMutation,
    EditAnnotationNoteMutationVariables
  >(EDIT_ANNOTATION_NOTE, {
    onCompleted: () => {
      dispatchToast.success(`Annotation note updated.`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error updating this note: ${error.message}`,
      );
    },
  });
  const saveAnnotationNote = () => {
    updateAnnotationNote({
      variables: {
        taskId,
        execution,
        originalMessage,
        newMessage,
      },
    });
    annotationAnalytics.sendEvent({ name: "Saved annotation note" });
  };

  return (
    <>
      <TextArea
        aria-labelledby="annotation-note-input"
        description={
          note &&
          `Updated: ${getDateCopy(note.source.time, { dateOnly: true })}
          Last Edited By: ${note.source.author}
          `
        }
        disabled={!userCanModify}
        id="noteInput"
        label="Note"
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        value={newMessage}
      />
      <Tooltip
        enabled={!userCanModify}
        trigger={
          <ButtonWrapper>
            <Button
              data-cy="edit-annotation-button"
              disabled={originalMessage === newMessage || !userCanModify}
              onClick={saveAnnotationNote}
              size={Size.XSmall}
              variant={Variant.Primary}
            >
              Save Note
            </Button>
          </ButtonWrapper>
        }
      >
        You are not authorized to edit failure details
      </Tooltip>
    </>
  );
};

export default AnnotationNote;
