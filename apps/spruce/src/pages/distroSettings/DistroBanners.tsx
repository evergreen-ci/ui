import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { size } from "@evg-ui/lib/constants/tokens";
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

  return (
    <>
      {banners.map(({ dataTestId, message, path, variant }) => (
        <StyledBanner key={path} data-testid={dataTestId} variant={variant}>
          {message}
        </StyledBanner>
      ))}
    </>
  );
};

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.m};
`;
