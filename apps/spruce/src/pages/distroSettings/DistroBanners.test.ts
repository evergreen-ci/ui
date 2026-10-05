import { Variant } from "@leafygreen-ui/banner";
import { getDistroBanners, sortBannersByUrgency } from "./DistroBanners";

const uiSchema = {
  distroOptions: {
    "ui:ObjectFieldTemplate": () => null,
    isIaCManaged: {
      "ui:description": "Description",
      "ui:distro-banner": "IaC banner",
      "ui:data-testid-distro-banner": "iac-managed-banner",
      "ui:distro-banner-variant": Variant.Warning,
    },
    isCluster: {
      "ui:distro-banner": "Cluster banner",
    },
    note: {
      "ui:widget": "textarea",
    },
    warningNote: {
      "ui:widget": "textarea",
      "ui:distro-banner": true,
    },
  },
};

describe("getDistroBanners", () => {
  it("returns banners for fields that are enabled", () => {
    expect(
      getDistroBanners(uiSchema, {
        distroOptions: {
          isIaCManaged: true,
          isCluster: false,
          note: "",
          warningNote: "",
        },
      }),
    ).toStrictEqual([
      {
        dataTestId: "iac-managed-banner",
        path: "distroOptions.isIaCManaged",
        message: "IaC banner",
        variant: Variant.Warning,
      },
    ]);
  });

  it("returns every enabled banner", () => {
    expect(
      getDistroBanners(uiSchema, {
        distroOptions: {
          isIaCManaged: true,
          isCluster: true,
          note: "",
          warningNote: "",
        },
      }),
    ).toStrictEqual([
      {
        dataTestId: "iac-managed-banner",
        path: "distroOptions.isIaCManaged",
        message: "IaC banner",
        variant: Variant.Warning,
      },
      {
        dataTestId: "distro-banner",
        path: "distroOptions.isCluster",
        message: "Cluster banner",
        variant: Variant.Info,
      },
    ]);
  });

  it("returns no banners when no fields are enabled", () => {
    expect(
      getDistroBanners(uiSchema, {
        distroOptions: {
          isIaCManaged: false,
          isCluster: false,
          note: "",
          warningNote: "",
        },
      }),
    ).toStrictEqual([]);
  });

  it("uses the field's value as the message when the option is true", () => {
    expect(
      getDistroBanners(uiSchema, {
        distroOptions: {
          isIaCManaged: false,
          isCluster: false,
          note: "A note",
          warningNote: "  Deprecated distro  ",
        },
      }),
    ).toStrictEqual([
      {
        dataTestId: "distro-banner",
        path: "distroOptions.warningNote",
        message: "Deprecated distro",
        variant: Variant.Info,
      },
    ]);
  });

  it("handles missing form data", () => {
    expect(getDistroBanners(uiSchema, undefined)).toStrictEqual([]);
  });
});

describe("sortBannersByUrgency", () => {
  const banner = (path: string, variant: Variant) => ({
    dataTestId: "distro-banner",
    path,
    message: path,
    variant,
  });

  it("puts the most urgent banners first", () => {
    expect(
      sortBannersByUrgency([
        banner("info", Variant.Info),
        banner("warning", Variant.Warning),
        banner("success", Variant.Success),
        banner("danger", Variant.Danger),
      ]).map(({ path }) => path),
    ).toStrictEqual(["danger", "warning", "info", "success"]);
  });

  it("keeps the original order for banners of equal urgency", () => {
    expect(
      sortBannersByUrgency([
        banner("first", Variant.Warning),
        banner("danger", Variant.Danger),
        banner("second", Variant.Warning),
      ]).map(({ path }) => path),
    ).toStrictEqual(["danger", "first", "second"]);
  });
});
