import { getBaseDistroName, getSizeRank } from "./utils";

describe("getBaseDistroName", () => {
  it("should remove basic suffixes", () => {
    expect(getBaseDistroName("ubuntu2204-small")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-medium")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-medium")).toBe("ubuntu2204");
  });

  it("should remove suffixes that are prefixed with x", () => {
    expect(getBaseDistroName("ubuntu2204-xxsmall")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-xsmall")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-xlarge")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-xxlarge")).toBe("ubuntu2204");
  });

  it("should remove suffixes that are prefixed with (num)x", () => {
    expect(getBaseDistroName("ubuntu2204-2xlarge")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-4xlarge")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-16xlarge")).toBe("ubuntu2204");
    expect(getBaseDistroName("ubuntu2204-32xlarge")).toBe("ubuntu2204");
  });
});

describe("getSizeRank", () => {
  it("should order sizes from smallest to largest", () => {
    const sizes = [
      "ubuntu2204-xlarge",
      "ubuntu2204-small",
      "ubuntu2204-16xlarge",
      "ubuntu2204-xxlarge",
      "ubuntu2204-medium",
      "ubuntu2204-4xlarge",
      "ubuntu2204-parent",
      "ubuntu2204-xsmall",
      "ubuntu2204-large",
      "ubuntu2204-xxsmall",
      "ubuntu2204-2xlarge",
    ];

    const sorted = sizes.sort((a, b) => getSizeRank(a) - getSizeRank(b));

    expect(sorted).toEqual([
      "ubuntu2204-xxsmall",
      "ubuntu2204-xsmall",
      "ubuntu2204-small",
      "ubuntu2204-medium",
      "ubuntu2204-large",
      "ubuntu2204-xlarge",
      "ubuntu2204-xxlarge",
      "ubuntu2204-2xlarge",
      "ubuntu2204-4xlarge",
      "ubuntu2204-16xlarge",
      "ubuntu2204-parent",
    ]);
  });
});
