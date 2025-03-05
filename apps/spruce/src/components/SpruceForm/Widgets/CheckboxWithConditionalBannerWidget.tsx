import { useState, useEffect } from "react";
import Banner from "@leafygreen-ui/banner";
import { LeafyGreenCheckBox } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { SpruceWidgetProps } from "components/SpruceForm/Widgets/types";

interface Props extends SpruceWidgetProps {
  options: SpruceWidgetProps["options"] & {
    originalValue: boolean;
    "data-cy-banner"?: string;
    enableCopy?: string;
    disableCopy?: string;
  };
}
export const CheckboxWithConditionalBannerWidget: React.FC<Props> = (props) => {
  const { value } = props;
  const {
    "data-cy-banner": dataCyBanner,
    disableCopy,
    enableCopy,
    originalValue,
  } = props.options;
  const [show, setShow] = useState(originalValue !== value);
  useEffect(() => {
    setShow(originalValue !== value);
  }, [value, originalValue]);
  return (
    <>
      <LeafyGreenCheckBox {...props} />
      {show && (
        <Banner
          data-cy={dataCyBanner}
          dismissible
          onClose={() => setShow(false)}
          style={{ marginBottom: "20px" }}
          variant="warning"
        >
          {value ? enableCopy : disableCopy}
        </Banner>
      )}
    </>
  );
};
