import { BasicEmptyState, Skeleton, Text } from "@via-ds/components";
import { cx } from "@evg-ui/lib/utils/css";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import styles from "./index.module.css";
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
        <div className={styles.skeletonList}>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className={patchCardStyles.cardWrapper}>
              <div className={patchCardStyles.left}>
                <Text
                  className={cx(
                    styles.skeletonDescription,
                    patchCardStyles.descriptionLink,
                  )}
                >
                  Patch description placeholder
                </Text>
                <Text className={styles.skeletonMetadata}>
                  Patch metadata placeholder
                </Text>
              </div>
              <div className={patchCardStyles.center}>
                <Text className={styles.skeletonStatus}>Patch status</Text>
              </div>
              <div className={patchCardStyles.right}>
                <Text className={styles.skeletonAction}>Actions</Text>
              </div>
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
