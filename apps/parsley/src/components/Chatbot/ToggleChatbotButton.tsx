import Button, { Size, Variant } from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { useChatbotContext } from "./Context";

interface Props {
  setSidePanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleChatbotButton: React.FC<Props> = ({
  setSidePanelCollapsed,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatbotContext();
  return (
    <Button
      leftGlyph={<Icon glyph="Sparkle" />}
      onClick={() => {
        if (!drawerOpen) {
          setSidePanelCollapsed(true);
        }
        setDrawerOpen((o) => !o);
      }}
      size={Size.XSmall}
      variant={Variant.PrimaryOutline}
    >
      Parsley AI
    </Button>
  );
};
