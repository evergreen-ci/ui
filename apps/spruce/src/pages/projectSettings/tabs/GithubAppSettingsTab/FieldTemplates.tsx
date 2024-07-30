import { useRef } from "react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { Body } from "@leafygreen-ui/typography";
import { ArrayFieldTemplateProps, Field } from "@rjsf/core";
import { StyledLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { githubAppCredentialsDocumentationUrl } from "constants/externalResources";
import {
  requesterToTitle,
  requesterToDescription,
  Requester,
} from "constants/requesters";
import { tableColumnOffset } from "constants/tokens";
import { Unpacked } from "types/utils";

export const RequesterTypeField: Field = ({
  formData,
}: {
  formData: Requester;
}) =>
  requesterToDescription[formData] ? (
    <InlineDefinition definition={requesterToDescription[formData]}>
      {requesterToTitle[formData]}
    </InlineDefinition>
  ) : (
    <Body>{requesterToTitle[formData]}</Body>
  );

export const GithubAppActions: Field = ({ uiSchema }) => {
  const {
    options: { isAppDefined },
  } = uiSchema;

  // TODO DEVPROD-9282: Add delete button.
  return isAppDefined ? null : (
    <Banner variant="warning" data-cy="github-app-credentials-banner">
      App ID and Key must be saved in order for token permissions restrictions
      to take effect. <br />
      <StyledLink href={githubAppCredentialsDocumentationUrl}>
        GitHub App Documentation
      </StyledLink>
    </Banner>
  );
};

type ArrayItem = Unpacked<ArrayFieldTemplateProps["items"]>;

export const ArrayFieldTemplate: React.FC<
  Pick<ArrayFieldTemplateProps, "items">
> = ({ items }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ArrayItem>({
    columns,
    containerRef: tableContainerRef,
    data: items,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });
  return (
    <BaseTable
      data-cy="github-token-permissions-restrictions-table"
      table={table}
    />
  );
};

const HeaderLabel = styled.span`
  width: 100%;
`;

const columns: LGColumnDef<ArrayItem>[] = [
  {
    header: () => (
      <>
        <HeaderLabel>Requester Type</HeaderLabel>
        <HeaderLabel style={{ marginLeft: tableColumnOffset }}>
          Permission Group
        </HeaderLabel>
      </>
    ),
    accessorKey: "children",
    cell: ({ row }) => row.original.children,
  },
];
