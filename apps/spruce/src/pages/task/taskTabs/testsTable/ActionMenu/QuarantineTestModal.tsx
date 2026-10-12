import { useState } from "react";
import {
  Body,
  Button,
  Content,
  Dialog,
  DialogRoot,
  Footer,
  Header,
  Text,
  TextArea,
} from "@via-ds/components";

interface Props {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export const QuarantineTestModal: React.FC<Props> = ({
  loading = false,
  onClose,
  onSubmit,
  visible,
}) => {
  const [comment, setComment] = useState("");
  const isCommentEmpty = comment.trim().length === 0;

  const resetForm = () => {
    setComment("");
  };

  return (
    <DialogRoot
      isOpen={visible}
      onOpenChange={(open) => {
        // User-initiated closes (cancel, X, Escape) reset the form; the parent
        // closes the dialog once the mutation resolves.
        if (!open) {
          onClose();
          resetForm();
        }
      }}
    >
      <Dialog data-testid="quarantine-test-modal">
        <Header>
          <Text slot="title">Quarantine Test</Text>
        </Header>
        <Content>
          <Body>
            Explain why this test is being quarantined. This comment is recorded
            on the associated Jira ticket.
          </Body>
          <TextArea
            data-testid="quarantine-test-comment"
            label="Comment"
            onChange={setComment}
            value={comment}
          />
        </Content>
        <Footer>
          <Button data-testid="quarantine-test-cancel" slot="cancel">
            Cancel
          </Button>
          <Button
            data-testid="quarantine-test-submit"
            isDisabled={isCommentEmpty || loading}
            onPress={() => {
              onSubmit(comment.trim());
            }}
            variant="primary"
          >
            Quarantine
          </Button>
        </Footer>
      </Dialog>
    </DialogRoot>
  );
};
