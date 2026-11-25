import { useState } from "react";
import { Banner, Text } from "@via-ds/components";
import ImportantWithCircle from "@via-ds/icons/ImportantWithCircle";
import { DisplayModal } from "components/DisplayModal";
import {
  BannerContainer,
  ListItem,
  ModalTriggerText,
  OrderedList,
  TitleWrapper,
} from "../styles";
import bannerStyles from "../styles.module.css";

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
      <Banner
        className={bannerStyles.alignedDismiss}
        onClose={() => setShowBanner(false)}
        variant="warning"
      >
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
        isOpen={showModal}
        onOpenChange={setShowModal}
        title={
          <TitleWrapper>
            <ImportantWithCircle size="xlarge" />
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
