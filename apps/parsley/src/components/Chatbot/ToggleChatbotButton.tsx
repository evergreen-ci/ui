import Button, { Size, Variant } from "@leafygreen-ui/button";
import { useChatContext } from "@evg-ui/fungi/useChatContext";
import Icon from "@evg-ui/lib/components/Icon";

interface Props {}

export const ToggleChatbotButton: React.FC<Props> = () => {
  const { setDrawerOpen } = useChatContext();
  return (
    <Button
      leftGlyph={<Icon glyph="Sparkle" />}
      onClick={() => {
        setDrawerOpen((o) => !o);
      }}
      size={Size.XSmall}
      variant={Variant.PrimaryOutline}
    >
      Parsley AI
    </Button>
  );
};
