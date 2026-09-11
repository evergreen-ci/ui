import { useState } from "react";
import { Banner } from "@via-ds/components/banner";
import { Text } from "@via-ds/components/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { DisplayModal } from "components/DisplayModal";
import {
  BannerContainer,
  ListItem,
  ModalTriggerText,
  OrderedList,
  TitleWrapper,
} from "../styles";

interface WarningBannerProps {
  warnings: string[];
}

export const WarningBanner: React.FC<WarningBannerProps> = ({ warnings }) => {
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const warningTitle =
    warnings.length === 1
      ? "1 warning in configuration file"
      : `${warnings.length} warnings in configuration file`;

  return showBanner ? (
    <BannerContainer data-testid="configuration-warnings-banner">
      <Banner onClose={() => setShowBanner(false)} variant="warning">
        <Text slot="title">{warningTitle}</Text>
        <Text>
          See all warnings{" "}
          <ModalTriggerText
            data-testid="configuration-warnings-modal-trigger"
            onClick={() => setShowModal(true)}
          >
            here
          </ModalTriggerText>
        </Text>
      </Banner>
      <DisplayModal
        data-testid="configuration-warnings-modal"
        open={showModal}
        setOpen={setShowModal}
        title={
          <TitleWrapper>
            <Icon glyph="ImportantWithCircle" size="xlarge" />
            <span>{warningTitle}</span>
          </TitleWrapper>
        }
      >
        <OrderedList>
          {warnings.map((w) => (
            <ListItem key={w}>{w}</ListItem>
          ))}
        </OrderedList>
      </DisplayModal>
    </BannerContainer>
  ) : null;
};
