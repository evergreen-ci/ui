import { AdminSettingsInput, BannerTheme } from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { AnnouncementsFormState } from "./types";

describe("announcements section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(adminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const form: AnnouncementsFormState = {
  announcements: {
    banner: "Hello",
    bannerTheme: BannerTheme.Information,
  },
};

const gql: AdminSettingsInput = {
  banner: "Hello",
  bannerTheme: BannerTheme.Information,
};
