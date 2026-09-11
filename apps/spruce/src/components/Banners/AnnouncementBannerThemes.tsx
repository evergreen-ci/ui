import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { BannerTheme } from "gql/generated/types";

export const bannerThemeToLabelMap: Record<BannerTheme, React.ReactNode> = {
  [BannerTheme.Announcement]: (
    <>
      Announcement <Badge variant={BadgeVariant.Success}>Green</Badge>
    </>
  ),
  [BannerTheme.Information]: (
    <>
      Information <Badge variant={BadgeVariant.Info}>Blue</Badge>
    </>
  ),
  [BannerTheme.Warning]: (
    <>
      Warning <Badge variant={BadgeVariant.Warning}>Yellow</Badge>
    </>
  ),
  [BannerTheme.Important]: (
    <>
      Urgent <Badge variant={BadgeVariant.Error}>Red</Badge>
    </>
  ),
};
