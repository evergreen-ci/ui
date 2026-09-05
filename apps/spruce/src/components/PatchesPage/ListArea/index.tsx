import { BasicEmptyState, Body, Skeleton, Text } from "@via-ds/components";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import PatchCard from "./PatchCard";

type ListAreaProps = {
  patches: PatchesPagePatchesFragment["patches"];
  pageType: "project" | "user";
  loading: boolean;
};

const ListArea: React.FC<ListAreaProps> = ({ loading, pageType, patches }) => {
  if (loading) {
    return (
      <Skeleton isLoading>
        <Body>Loading patches</Body>
        <Body>Loading patches</Body>
        <Body>Loading patches</Body>
        <Body>Loading patches</Body>
        <Body>Loading patches</Body>
      </Skeleton>
    );
  }
  if (patches.length > 0) {
    return (
      <>
        {patches.map((p) => (
          <PatchCard key={p.id} pageType={pageType} patch={p} />
        ))}
      </>
    );
  }
  return (
    <BasicEmptyState>
      <Text slot="title">No patches found</Text>
      <Text slot="description">Create a patch to see it here.</Text>
    </BasicEmptyState>
  );
};

export default ListArea;
