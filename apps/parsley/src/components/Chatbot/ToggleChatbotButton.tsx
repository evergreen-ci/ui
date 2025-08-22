import Button, { Size, Variant } from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { useChatbotContext } from "./Context";

interface Props {}

export const ToggleChatbotButton: React.FC<Props> = () => {
  const { setDrawerOpen } = useChatbotContext();
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
