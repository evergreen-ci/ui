import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useAnnotationAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
  IssueLinkInput,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations";
import { useSpruceConfig } from "hooks";
import { numbers, string } from "utils";

const { toDecimal } = numbers;
const { getTicketFromJiraURL } = string;

interface Props {
  visible: boolean;
  closeModal: () => void;
  setSelectedRowKey: (key: string) => void;
  taskId: string;
  execution: number;
  isIssue: boolean;
}

export const AddIssueModal: React.FC<Props> = ({
  closeModal,
  execution,
  isIssue,
  setSelectedRowKey,
  taskId,
  visible,
  ...rest
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const title = isIssue ? "Add Issue" : "Add Suspected Issue";
  const issueString = isIssue ? "issue" : "suspected issue";

  const [canSubmit, setCanSubmit] = useState(false);
  const [formState, setFormState] = useState({
    advancedOptions: {
      confidenceScore: null,
    },
    url: "",
  });
  const issueKey = getTicketFromJiraURL(formState.url);

  const [addAnnotation] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully added ${issueString}`);
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setSelectedRowKey(issueKey);
      closeModal();
      annotationAnalytics.sendEvent({
        "annotation.type": isIssue ? "Issue" : "Suspected Issue",
        name: "Created task annotation",
      });
    },
    onError(error) {
      closeModal();
      dispatchToast.error(
        `There was an error adding the issue: ${error.message}`,
      );
    },
    refetchQueries: ["SuspectedIssues", "Issues"],
  });

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const handleSubmit = () => {
    const apiIssue: IssueLinkInput = {
      confidenceScore: toDecimal(formState.advancedOptions.confidenceScore),
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      issueKey,
      url: formState.url,
    };
    addAnnotation({ variables: { apiIssue, execution, isIssue, taskId } });
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <ConfirmationModal
      {...rest}
      cancelButtonProps={{
        onClick: handleCancel,
      }}
      confirmButtonProps={{
        children: `Add ${issueString}`,
        disabled: !canSubmit,
        onClick: handleSubmit,
      }}
      data-cy="add-issue-modal"
      open={visible}
      title={title}
    >
      {jiraHost && (
        <SpruceForm
          customFormatFields={{
            jiraHost,
          }}
          formData={formState}
          onChange={({ errors, formData }) => {
            setFormState(formData);
            setCanSubmit(errors.length === 0);
          }}
          onSubmit={handleSubmit}
          schema={addIssueModalSchema.schema}
          uiSchema={addIssueModalSchema.uiSchema}
        />
      )}
    </ConfirmationModal>
  );
};

const addIssueModalSchema: SpruceFormProps = {
  schema: {
    properties: {
      advancedOptions: {
        properties: {
          confidenceScore: {
            maximum: 100,
            minimum: 0,
            title: "Confidence Score",
            type: ["number", "null"],
          },
        },
        type: "object" as const,
      },
      url: {
        format: "validJiraURL",
        minLength: 1,
        title: "Ticket URL",
        type: "string" as const,
      },
    },
    required: ["url"],
    type: "object" as const,
  },
  uiSchema: {
    advancedOptions: {
      confidenceScore: {
        "ui:data-cy": "confidence-level",
        "ui:description":
          "The confidence score of the issue. This is a number between 0 and 100 representing a percentage.",
        "ui:optional": true,
      },
      "ui:displayTitle": "Advanced Options",
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    },
    url: {
      "ui:data-cy": "issue-url",
    },
  },
};
