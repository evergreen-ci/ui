import { useState } from "react";
import {
  Button,
  Content,
  Dialog,
  DialogRoot,
  Footer,
  Header,
  Text,
  TextArea,
  TextField,
} from "@via-ds/components";
import styles from "./QuarantineTestModal.module.css";

const jiraTicketKeyRegex = /^[A-Z][A-Z0-9_]*-[0-9]+$/i;

const parseJiraTickets = (input: string): string[] =>
  Array.from(new Set(input.split(/[\s,]+/).filter(Boolean)));

export interface QuarantineDetails {
  existingJiraTicketsToLink?: string[];
  justification?: string;
}

interface QuarantineTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: QuarantineDetails) => void;
  requireJiraTickets: boolean;
  testName: string;
}

export const QuarantineTestModal: React.FC<QuarantineTestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  requireJiraTickets,
  testName,
}) => {
  const [existingJiraTicketsToLinkInput, setExistingJiraTicketsToLinkInput] =
    useState("");
  const [justification, setJustification] = useState("");

  const existingJiraTicketsToLink = parseJiraTickets(
    existingJiraTicketsToLinkInput,
  );
  const invalidJiraTickets = existingJiraTicketsToLink.filter(
    (ticket) => !jiraTicketKeyRegex.test(ticket),
  );
  const isMissingRequiredJiraTickets =
    requireJiraTickets && existingJiraTicketsToLink.length === 0;

  const resetForm = () => {
    setExistingJiraTicketsToLinkInput("");
    setJustification("");
  };

  const onPressQuarantine = () => {
    onConfirm({
      existingJiraTicketsToLink:
        existingJiraTicketsToLink.length > 0
          ? existingJiraTicketsToLink
          : undefined,
      justification: justification.trim() || undefined,
    });
    resetForm();
  };

  return (
    <DialogRoot
      isOpen={isOpen}
      onOpenChange={(open) => {
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
          <Text className={styles.description} textStyle="description">
            {`"${testName}" will not run in patches and merge queues until it is unquarantined.`}
          </Text>
          <TextField
            className={styles.field}
            data-testid="quarantine-jira-tickets"
            description="Existing jira tickets to link this this quarantine against. Comma separated like: BF-123, CLOUDP-456."
            errorMessage={`Not a valid Jira ticket key: ${invalidJiraTickets.join(", ")}`}
            isInvalid={invalidJiraTickets.length > 0}
            isOptional={!requireJiraTickets}
            isRequired={requireJiraTickets}
            label="Jira tickets to link to"
            onChange={setExistingJiraTicketsToLinkInput}
            value={existingJiraTicketsToLinkInput}
          />
          <TextArea
            data-testid="quarantine-justification"
            description="Why this test is being quarantined or any other comments."
            isOptional
            label="Justification"
            onChange={setJustification}
            value={justification}
          />
        </Content>
        <Footer>
          <Button slot="cancel">Cancel</Button>
          <Button
            data-testid="confirm-quarantine-test"
            isDisabled={
              invalidJiraTickets.length > 0 || isMissingRequiredJiraTickets
            }
            onPress={onPressQuarantine}
            slot="action"
            variant="primary"
          >
            Quarantine
          </Button>
        </Footer>
      </Dialog>
    </DialogRoot>
  );
};
