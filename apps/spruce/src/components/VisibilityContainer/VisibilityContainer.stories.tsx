import { useEffect } from "react";
import { action } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";

import styles from "./VisibilityContainer.stories.module.css";
import VisibilityContainer from ".";

export default {
  component: VisibilityContainer,
} satisfies CustomMeta<typeof VisibilityContainer>;

export const Default: CustomStoryObj<typeof VisibilityContainer> = {
  render: () => (
    <>
      Scroll the below container out of view and observe the component mounting
      and unmounting
      <div className={styles.scrollableContainer}>
        <div className={styles.innerContainer}>
          <VisibilityContainer>
            <RenderedContent />
          </VisibilityContainer>
        </div>
      </div>
    </>
  ),
};

const RenderedContent = () => {
  useEffect(() => {
    action("RenderedContent mounted")();
    return () => {
      action("RenderedContent unmounted")();
    };
  }, []);
  return <div>Visible content</div>;
};
