import { useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { useDistroSettingsAnalytics } from "analytics";
import { GetFormSchema } from "components/SpruceForm";
import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroQuery } from "gql/generated/types";
import { getFormSchema as getGeneralFormSchema } from "./tabs/GeneralTab/getFormSchema";
import { FormStateMap } from "./tabs/types";

type UiSchema = ReturnType<GetFormSchema>["uiSchema"];

const DISTRO_BANNER_KEY = "ui:distro-banner";
const DISTRO_BANNER_TEST_ID_KEY = "ui:data-testid-distro-banner";
const DEFAULT_DISTRO_BANNER_TEST_ID = "distro-banner";
const DISTRO_BANNER_VARIANT_KEY = "ui:distro-banner-variant";
const DEFAULT_DISTRO_BANNER_VARIANT = Variant.Info;
const MAX_PEEKING_CARDS = 2;
const PEEK_OFFSET_PX = 6;

const { blue, green, red, yellow } = palette;

const variantUrgency: Record<Variant, number> = {
  [Variant.Danger]: 0,
  [Variant.Warning]: 1,
  [Variant.Info]: 2,
  [Variant.Success]: 3,
};

const peekingCardColors: Record<
  Variant,
  { background: string; border: string }
> = {
  [Variant.Danger]: { background: red.light3, border: red.light2 },
  [Variant.Warning]: { background: yellow.light3, border: yellow.light2 },
  [Variant.Info]: { background: blue.light3, border: blue.light2 },
  [Variant.Success]: { background: green.light3, border: green.light2 },
};

const isBannerVariant = (value: unknown): value is Variant =>
  Object.values(Variant).includes(value as Variant);

interface DistroBanner {
  dataTestId: string;
  /** Dot-separated path to the field, unique across the uiSchema. */
  path: string;
  message: string;
  variant: Variant;
}

const getBannerMessage = (
  option: unknown,
  fieldValue: unknown,
): string | undefined => {
  if (option === true) {
    return typeof fieldValue === "string" ? fieldValue.trim() : undefined;
  }
  return typeof option === "string" && fieldValue ? option : undefined;
};

/**
 * Collects the banners configured by "ui:distro-banner" in the uiSchema. The option can be:
 * - a string, shown as the banner message when the field's value is truthy
 * - `true`, which shows the field's own value as the banner message when it is a non-empty string
 * @param uiSchema - the uiSchema to search
 * @param formData - the form data corresponding to the uiSchema
 * @param path - the path of the uiSchema within the root uiSchema
 * @returns the banners to display
 */
export const getDistroBanners = (
  uiSchema: UiSchema,
  formData: unknown,
  path: string[] = [],
): DistroBanner[] =>
  Object.entries(uiSchema ?? {}).flatMap(([key, value]) => {
    if (key === DISTRO_BANNER_KEY) {
      const message = getBannerMessage(value, formData);
      if (!message) {
        return [];
      }
      const dataTestId = uiSchema?.[DISTRO_BANNER_TEST_ID_KEY];
      const variant = uiSchema?.[DISTRO_BANNER_VARIANT_KEY];
      return [
        {
          dataTestId:
            typeof dataTestId === "string"
              ? dataTestId
              : DEFAULT_DISTRO_BANNER_TEST_ID,
          path: path.join("."),
          message,
          variant: isBannerVariant(variant)
            ? variant
            : DEFAULT_DISTRO_BANNER_VARIANT,
        },
      ];
    }
    if (key.startsWith("ui:") || typeof value !== "object" || !value) {
      return [];
    }
    return getDistroBanners(
      value,
      (formData as Record<string, unknown> | undefined)?.[key],
      [...path, key],
    );
  });

/**
 * Orders banners so the most urgent appear first. Banners of equal urgency keep their uiSchema order.
 * @param banners - the banners to sort
 * @returns a new array of banners, most urgent first
 */
export const sortBannersByUrgency = (banners: DistroBanner[]): DistroBanner[] =>
  [...banners].sort(
    (a, b) => variantUrgency[a.variant] - variantUrgency[b.variant],
  );

interface DistroBannersProps {
  distro: NonNullable<DistroQuery["distro"]>;
  tabData: FormStateMap;
}

export const DistroBanners: React.FC<DistroBannersProps> = ({
  distro,
  tabData,
}) => {
  // Banners reflect the saved distro, so they only need each tab's uiSchema, not its live form state.
  const { uiSchema: generalUiSchema } = getGeneralFormSchema(
    false,
    distro.hostAllocatorSettings.minimumHosts,
    [],
  );
  const banners = getDistroBanners(
    generalUiSchema,
    tabData[DistroSettingsTabRoutes.General],
  );

  const deck = sortBannersByUrgency(banners);
  const { sendEvent } = useDistroSettingsAnalytics();
  const [position, setPosition] = useState(0);
  const [hasCycled, setHasCycled] = useState(false);
  if (deck.length === 0) {
    return null;
  }
  // The deck can shrink after a save, so the position is wrapped rather than trusted.
  const topIndex = position % deck.length;
  const topCard = deck[topIndex];
  const peekingCards = Array.from(
    { length: Math.min(deck.length - 1, MAX_PEEKING_CARDS) },
    (_, i) => deck[(topIndex + i + 1) % deck.length],
  );
  const nextIndex = (topIndex + 1) % deck.length;
  const showNextBanner = () => {
    sendEvent({
      name: "Clicked next banner",
      "banner.path": topCard.path,
      "banner.position": topIndex + 1,
      "banner.count": deck.length,
    });
    setPosition(nextIndex);
    setHasCycled(true);
  };

  return (
    <Deck peekingCount={peekingCards.length}>
      {/* A stable live region, because each card remounts and screen readers do not announce newly mounted regions. */}
      <ScreenReaderOnly aria-live="polite">
        {deck.length > 1 &&
          hasCycled &&
          `Banner ${topIndex + 1} of ${deck.length}: ${topCard.message}`}
      </ScreenReaderOnly>
      {peekingCards.map(({ path, variant }, i) => (
        <PeekingCard key={path} depth={i + 1} variant={variant} />
      ))}
      <TopCard
        key={topCard.path}
        data-testid={topCard.dataTestId}
        variant={topCard.variant}
      >
        <CardContent>
          <span>{topCard.message}</span>
          {deck.length > 1 && (
            <NextButton
              aria-label={`Show next banner (${nextIndex + 1} of ${deck.length})`}
              data-testid="distro-banner-next"
              onClick={showNextBanner}
            >
              <ThinChevronRight />
            </NextButton>
          )}
        </CardContent>
      </TopCard>
    </Deck>
  );
};

const dealIn = keyframes`
  from {
    transform: translateY(${PEEK_OFFSET_PX}px);
    opacity: 0.6;
  }
`;

// The z-index creates a stacking context so the cards' own z-indexes stay below the sticky tab header.
const Deck = styled.div<{ peekingCount: number }>`
  position: relative;
  z-index: 0;
  margin-bottom: calc(
    ${size.m} + ${({ peekingCount }) => peekingCount * PEEK_OFFSET_PX}px
  );
`;

const PeekingCard = styled.div<{ depth: number; variant: Variant }>`
  position: absolute;
  inset: 0;
  z-index: ${({ depth }) => MAX_PEEKING_CARDS - depth};
  transform: translateY(${({ depth }) => depth * PEEK_OFFSET_PX}px)
    scaleX(${({ depth }) => 1 - depth * 0.02});
  background-color: ${({ variant }) => peekingCardColors[variant].background};
  border: 1px solid ${({ variant }) => peekingCardColors[variant].border};
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

const TopCard = styled(Banner)`
  position: relative;
  z-index: ${MAX_PEEKING_CARDS};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (prefers-reduced-motion: no-preference) {
    animation: ${dealIn} 150ms ease-out;
  }
`;

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${size.s};
`;

// The icon library's chevrons are solid glyphs, which look heavy next to banner text.
const ThinChevronRight = () => (
  <svg aria-hidden fill="none" height={16} viewBox="0 0 16 16" width={16}>
    <polyline
      points="6,3 11,8 6,13"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

// Inherits the banner's text color so the button matches the variant of the card it is on.
const NextButton = styled(IconButton)`
  color: inherit;
  &:hover,
  &:focus-visible {
    color: inherit;
  }
`;
