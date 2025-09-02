import { useState } from "react";
import Button, { Size, Variant } from "@leafygreen-ui/button";
import { useChatContext } from "@evg-ui/fungi/Context";
import Icon from "@evg-ui/lib/components/Icon";
import { useMergedBetaFeatures } from "@evg-ui/lib/hooks/useBetaFeatures";
import { ParsleyAIModal } from "components/ParsleyAIModal";

interface Props {}

export const ToggleChatbotButton: React.FC<Props> = () => {
  const { setDrawerOpen } = useChatContext();

  const [modalOpen, setModalOpen] = useState(false);

  const { betaFeatures } = useMergedBetaFeatures();
  const { parsleyAIEnabled } = betaFeatures ?? {};

  return (
    <>
      <Button
        leftGlyph={<Icon glyph="Sparkle" />}
        onClick={() => {
          if (parsleyAIEnabled) {
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
