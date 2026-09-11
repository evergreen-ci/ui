import { useState } from "react";
import { Callout } from "@via-ds/components/callout";
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

interface ErrorBannerProps {
  errors: string[];
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ errors }) => {
  const [showModal, setShowModal] = useState(false);

  const errorTitle =
    errors.length === 1
      ? "1 error in configuration file"
      : `${errors.length} errors in configuration file`;

  return (
    <BannerContainer data-testid="configuration-errors-banner">
      <Callout variant="warning">
        <Text slot="title">{errorTitle}</Text>
        <Text>
          {errors[0]}
          {errors.length > 1 && (
            <>
              <br />
              <ModalTriggerText
                data-testid="configuration-errors-modal-trigger"
                onClick={() => setShowModal(true)}
              >
                See all errors
              </ModalTriggerText>
            </>
          )}
        </Text>
      </Callout>
      <DisplayModal
        data-testid="configuration-errors-modal"
        open={showModal}
        setOpen={setShowModal}
        title={
          <TitleWrapper>
            <Icon glyph="Warning" size="xlarge" />
            <span>{errorTitle}</span>
          </TitleWrapper>
        }
      >
        <OrderedList>
          {errors.map((e) => (
            <ListItem key={e}>{e}</ListItem>
          ))}
        </OrderedList>
      </DisplayModal>
    </BannerContainer>
  );
};
