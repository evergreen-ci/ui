import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import PatchCard from "./PatchCard";

type ListAreaProps = {
  patches: PatchesPagePatchesFragment["patches"];
  pageType: "project" | "user";
  loading: boolean;
};

const ListArea: React.FC<ListAreaProps> = ({ loading, pageType, patches }) => {
  if (loading) {
    return <ListSkeleton />;
  }
  if (patches.length > 0) {
    return (
      <>
        {patches.map((p) => (
          <PatchCard
            key={p.id}
            pageType={pageType}
            patch={p}
            isPatchOnCommitQueue={p.commitQueuePosition !== null}
          />
        ))}
      </>
    );
  }
  return (
    <BasicEmptyState
      title="No patches found"
      description="Create a patch to see it here."
    />
  );
};

export default ListArea;
