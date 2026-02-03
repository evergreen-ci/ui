import { useState } from "react";
import styled from "@emotion/styled";
import { Disclaimer, InlineCode } from "@leafygreen-ui/typography";
import {
  StyledLink,
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components";
import { DisplayModal } from "components/DisplayModal";
import { MetadataItem } from "components/MetadataCard";
import { IncludedLocalModule } from "gql/generated/types";

interface Props {
  includedLocalModules: IncludedLocalModule[];
}

const IncludedLocalModules: React.FC<Props> = ({ includedLocalModules }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const table = useLeafyGreenTable<IncludedLocalModule>({
    columns,
    data: includedLocalModules,
    enableColumnFilters: false,
  });

  return (
    <>
      {includedLocalModules !== undefined &&
        includedLocalModules.length > 0 && (
          <MetadataItem>
            {/* @ts-expect-error: Links should have hrefs. */}
            <StyledLink
              data-cy="included-local-modules-link"
              onClick={() => setShowModal(true)}
            >
              View included modules ({includedLocalModules.length})
            </StyledLink>
          </MetadataItem>
        )}
      <DisplayModal
        data-cy="included-local-modules-modal"
        open={showModal}
        setOpen={setShowModal}
        size="large"
        title="Included Local Modules"
      >
        <Disclaimer>
          These are the local modules that were included in the patch when{" "}
          <InlineCode>--include-modules</InlineCode> was used.
        </Disclaimer>
        <OverflowContainer>
          <BaseTable shouldAlternateRowColor table={table} />
        </OverflowContainer>
      </DisplayModal>
    </>
  );
};

export default IncludedLocalModules;

const OverflowContainer = styled.div`
  max-height: 600px;
  overflow-y: scroll;
`;

const columns: LGColumnDef<IncludedLocalModule>[] = [
  {
    accessorKey: "module",
    header: "Module",
  },
  {
    accessorKey: "fileName",
    header: "Filename",
  },
];
