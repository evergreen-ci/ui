import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";

import { HostStatus } from "types/host";
import styles from "./HostStatusBadge.stories.module.css";
import HostStatusBadge from ".";

export default {
  component: HostStatusBadge,
} satisfies CustomMeta<typeof HostStatusBadge>;

export const Default: CustomStoryObj<typeof HostStatusBadge> = {
  render: () => (
    <div className={styles.container}>
      {Object.keys(HostStatus).map((status) => (
        <div key={`badge_${status}`} className={styles.wrapper}>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <HostStatusBadge status={HostStatus[status]} />
        </div>
      ))}
    </div>
  ),
};
