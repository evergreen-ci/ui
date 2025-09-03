import { useState } from "react";
import Button, { Size, Variant } from "@leafygreen-ui/button";
import { ParsleyAIModal } from "components/ParsleyAIModal";
import { useChatContext } from "@evg-ui/fungi/Context";
import Icon from "@evg-ui/lib/components/Icon";
import { useUserBetaFeatures } from "@evg-ui/lib/hooks/useBetaFeatures";

interface Props {
  setSidePanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleChatbotButton: React.FC<Props> = ({
  setSidePanelCollapsed,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();

  const [modalOpen, setModalOpen] = useState(false);

  const { userBetaSettings } = useUserBetaFeatures();

  return userBetaSettings ? (
    <>
      <Button
        leftGlyph={<Icon glyph="Sparkle" />}
        onClick={() => {
          if (!drawerOpen) {
            setSidePanelCollapsed(true);
          }

          if (userBetaSettings.parsleyAIEnabled) {
            setDrawerOpen((o) => !o);
          } else {
            setModalOpen(true);
          }
        }}
        size={Size.XSmall}
        variant={Variant.PrimaryOutline}
      >
        Parsley AI
      </Button>
      <ParsleyAIModal open={modalOpen} setOpen={setModalOpen} />
    </>
  ) : null;
};
