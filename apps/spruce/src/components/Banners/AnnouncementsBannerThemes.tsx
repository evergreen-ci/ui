import { Badge, Variant } from "@leafygreen-ui/badge";
import { BannerTheme } from "gql/generated/types";

export const bannerThemeToLabelMap: Record<BannerTheme, React.ReactNode> = {
  [BannerTheme.Announcement]: (
    <>
      Announcement <Badge variant={Variant.Green}>Green</Badge>
    </>
  ),
  [BannerTheme.Information]: (
    <>
      Information <Badge variant={Variant.Blue}>Blue</Badge>
    </>
  ),
  [BannerTheme.Warning]: (
    <>
      Warning <Badge variant={Variant.Yellow}>Yellow</Badge>
    </>
  ),
  [BannerTheme.Important]: (
    <>
      Urgent <Badge variant={Variant.Red}>Red</Badge>
    </>
  ),
};
