import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { ClassNames } from "@emotion/react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Modal from "@leafygreen-ui/modal";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { StyledLink as Link } from "@evg-ui/lib/components/styles";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UseSpruceOptionsInput,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { reportError } from "utils/errorReporting";
import CarouselCard from "./CarouselCard";
import CarouselDots from "./CarouselDots";
import { CardType } from "./types";

interface WelcomeModalProps {
  param: keyof UseSpruceOptionsInput;
  title?: string;
  carouselCards: CardType[];
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  carouselCards,
  param,
  title,
}) => {
  const [visible, setVisible] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const slider = useRef<CarouselRef>(null);
  const [updateUserSettings] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      setVisible(false);
    },
    onError: (err) => {
      reportError(err).warning();
      setVisible(false);
    },
  });

  const handleClosed = () => {
    try {
      updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              [param]: true,
            },
          },
        },
        refetchQueries: ["UserSettings"],
      });
    } catch (e) {}
  };

  const handleCarouselChange = (index: number) => {
    setActiveSlide(index);
    slider.current?.goTo(index);
  };
  return (
    <ClassNames>
      {({ css }) => (
        <Modal
          className={css`
            z-index: ${zIndex.max_do_not_use};
          `}
          data-cy="welcome-modal"
          open={visible}
          setOpen={handleClosed}
          size="large"
        >
          {title && <CardTitle>{title}</CardTitle>}
          <Carousel
            ref={slider}
            afterChange={(index) => setActiveSlide(index)}
            dots={false}
            draggable
            infinite={false}
            lazyLoad="ondemand"
          >
            {carouselCards.map((card, index) => (
              <CarouselCard
                key={`card_${card.subtitle ?? card.title}`}
                card={card}
                visible={activeSlide === index}
              />
            ))}
          </Carousel>
          <Footer>
            <CarouselDots
              activeSlide={activeSlide}
              cards={carouselCards}
              onClick={handleCarouselChange}
            />
            <div>
              {carouselCards[activeSlide].href && (
                <StyledLink href={carouselCards[activeSlide].href ?? ""}>
                  Learn more
                </StyledLink>
              )}
              <Button
                data-cy="close-welcome-modal"
                onClick={handleClosed}
                variant={Variant.Primary}
              >
                Close
              </Button>
            </div>
          </Footer>
        </Modal>
      )}
    </ClassNames>
  );
};

const StyledLink = styled(Link)`
  margin-right: ${size.s};
`;

const CardTitle = styled(Subtitle)<SubtitleProps>`
  display: flex;
  justify-content: center;
  margin-bottom: ${size.s};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export default WelcomeModal;
