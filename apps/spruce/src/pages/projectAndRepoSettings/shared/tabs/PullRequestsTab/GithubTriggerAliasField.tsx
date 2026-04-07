import styled from "@emotion/styled";
import { InlineDefinition } from "@leafygreen-ui/inline-definition";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import { PatchTriggerAliasStatus } from "../utils";

type TaskSpecifier = {
  patchAlias?: string;
  taskRegex?: string;
  variantRegex?: string;
};

type TriggerAliasFormData = {
  alias: string;
  childProjectIdentifier?: string;
  parentAsModule?: string;
  status?: keyof typeof PatchTriggerAliasStatus;
  taskSpecifiers?: TaskSpecifier[];
};

export const GithubTriggerAliasField: Field = ({ formData }) => {
  if (!formData) {
    return null;
  }

  const {
    alias,
    childProjectIdentifier,
    parentAsModule,
    status,
    taskSpecifiers = [],
  } = formData as TriggerAliasFormData;

  const hoverContent = (
    <>
      <Body>
        <strong>Project:</strong> {childProjectIdentifier}
      </Body>
      {parentAsModule && (
        <Body>
          <strong>Module:</strong> {parentAsModule}
        </Body>
      )}
      {status && (
        <Body>
          <strong>Wait On:</strong> {PatchTriggerAliasStatus[status]}
        </Body>
      )}
      {!!taskSpecifiers.length && (
        <>
          <Body>
            <strong>Variant/Task Regex Pairs</strong>
          </Body>
          <Ul>
            {taskSpecifiers.map(
              ({ patchAlias, taskRegex, variantRegex }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>
                  {patchAlias ? (
                    <>Patch Alias: {patchAlias}</>
                  ) : (
                    <>
                      Variants: <InlineCode>{variantRegex}</InlineCode>
                      <br />
                      Tasks: <InlineCode>{taskRegex}</InlineCode>
                    </>
                  )}
                </li>
              ),
            )}
          </Ul>
        </>
      )}
    </>
  );

  return (
    <InlineDefinition
      align="right"
      data-cy="pta-tooltip"
      definition={hoverContent}
      justify="start"
    >
      <span data-cy="pta-item">{alias}</span>
    </InlineDefinition>
  );
};

const Ul = styled.ul`
  margin-bottom: 0;
  padding-left: ${size.s};
`;
