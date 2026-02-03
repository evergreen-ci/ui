import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useToastContext } from "@evg-ui/lib/context";
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
    url: "",
    advancedOptions: {
      confidenceScore: null,
    },
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
        name: "Created task annotation",
        "annotation.type": isIssue ? "Issue" : "Suspected Issue",
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
      url: formState.url,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      issueKey,
      confidenceScore: toDecimal(formState.advancedOptions.confidenceScore),
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
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
    type: "object" as const,
    properties: {
      url: {
        type: "string" as const,
        title: "Ticket URL",
        minLength: 1,
        format: "validJiraURL",
      },
      advancedOptions: {
        type: "object" as const,
        properties: {
          confidenceScore: {
            type: ["number", "null"],
            title: "Confidence Score",
            minimum: 0,
            maximum: 100,
          },
        },
      },
    },
    required: ["url"],
  },
  uiSchema: {
    url: {
      "ui:data-cy": "issue-url",
    },
    advancedOptions: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:displayTitle": "Advanced Options",
      confidenceScore: {
        "ui:data-cy": "confidence-level",
        "ui:description":
          "The confidence score of the issue. This is a number between 0 and 100 representing a percentage.",
        "ui:optional": true,
      },
    },
  },
};
