import { Button, Size, Variant } from "@leafygreen-ui/button";
import { useChatContext } from "@evg-ui/fungi";
import Icon from "@evg-ui/lib/components/Icon";

interface Props {
  setSidePanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleChatbotButton: React.FC<Props> = ({
  setSidePanelCollapsed,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <Button
      leftGlyph={<Icon glyph="Sparkle" />}
      onClick={() => {
        if (!drawerOpen) {
          setSidePanelCollapsed(true);
        }
        setDrawerOpen((o: boolean) => !o);
      }}
      size={Size.XSmall}
      variant={Variant.PrimaryOutline}
    >
      Parsley AI
    </Button>
  );
};
