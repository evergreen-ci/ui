import { BasicEmptyState, Skeleton, Text } from "@via-ds/components";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import PatchCard from "./PatchCard";
import patchCardStyles from "./PatchCard/index.module.css";

type ListAreaProps = {
  patches: PatchesPagePatchesFragment["patches"];
  pageType: "project" | "user";
  loading: boolean;
};

const ListArea: React.FC<ListAreaProps> = ({ loading, pageType, patches }) => {
  if (loading) {
    return (
      <Skeleton isLoading>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={patchCardStyles.cardWrapper}>
            <div className={patchCardStyles.left}>
              <Text className={patchCardStyles.descriptionLink}>
                evergreen-ci/ui pull request #1930: Migrate PatchesPage to Via
              </Text>
              <Text>Sep 11, 2026 by Evergreen User</Text>
            </div>
            <div className={patchCardStyles.center}>
              <div className={patchCardStyles.patchBadgeContainer}>
                <Text>Created/Unconfigured</Text>
              </div>
              <div className={patchCardStyles.taskBadgeContainer}>
                <Text>3 succeeded, 1 failed</Text>
              </div>
            </div>
            <div className={patchCardStyles.right}>
              <Text>Actions</Text>
            </div>
          </div>
        ))}
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
