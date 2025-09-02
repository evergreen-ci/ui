import { useState } from "react";
import Button, { Size, Variant } from "@leafygreen-ui/button";
import { useChatContext } from "@evg-ui/fungi/Context";
import Icon from "@evg-ui/lib/components/Icon";
import { useUserBetaFeatures } from "@evg-ui/lib/hooks/useBetaFeatures";
import { ParsleyAIModal } from "components/ParsleyAIModal";

interface Props {}

export const ToggleChatbotButton: React.FC<Props> = () => {
  const { setDrawerOpen } = useChatContext();

  const [modalOpen, setModalOpen] = useState(false);

  const { userBetaSettings } = useUserBetaFeatures();

  return (
    <>
      <Button
        leftGlyph={<Icon glyph="Sparkle" />}
        onClick={() => {
          if (userBetaSettings?.parsleyAIEnabled) {
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
  );
};
