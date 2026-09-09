import { BasicEmptyState, Skeleton, Text } from "@via-ds/components";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import styles from "./index.module.css";
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
        <div className={styles.skeletonList}>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonContent}>
                <Text className={styles.skeletonDescription}>
                  Patch description placeholder
                </Text>
                <Text className={styles.skeletonMetadata}>
                  Patch metadata placeholder
                </Text>
              </div>
              <Text className={styles.skeletonStatus}>Patch status</Text>
              <Text className={styles.skeletonAction}>Actions</Text>
            </div>
          ))}
        </div>
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
