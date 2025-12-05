import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { ReleaseStepStatus } from "./types";
import ReleaseViewCard from "./index";

const meta: CustomMeta<typeof ReleaseViewCard> = {
  title: "Components/ReleaseView/ReleaseViewCard",
  component: ReleaseViewCard,
  tags: ["autodocs"],
  argTypes: {
    releaseName: { control: "text" },
    steps: { control: "object" },
    subRelease: { control: "object" },
  },
};

export default meta;

const releasesList = [
  {
    releaseName: "mongotune-linux-bin-x86_64-amazon-2",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 600000,
      },
      {
        name: "Signed",
        status: ReleaseStepStatus.COMPLETED,
        duration: 5400000,
      },
      {
        name: "Private Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 2700000,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.COMPLETED,
        duration: 300000,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 7200000,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 900000,
      },
    ],
    links: [
      { label: "Jira", href: "https://jira.example.com/browse/MNG-1" },
      {
        label: "GitHub",
        href: "https://github.com/mongodb/mongo/releases/tag/v1",
      },
    ],
  },
  {
    releaseName: "mongotune-windows-bin-x86_64",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 500000,
      },
      {
        name: "Signed",
        status: ReleaseStepStatus.COMPLETED,
        duration: 4800000,
      },
      {
        name: "Private Published",
        status: ReleaseStepStatus.IN_PROGRESS,
        duration: 1200000,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
    ],
    links: [{ label: "Jira", href: "https://jira.example.com/browse/MNG-2" }],
  },
  {
    releaseName: "mongotune-macos-bin-x86_64",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 400000,
      },
      {
        name: "Signed",
        status: ReleaseStepStatus.COMPLETED,
        duration: 4000000,
      },
      {
        name: "Private Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 2000000,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.COMPLETED,
        duration: 200000,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 6000000,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.IN_PROGRESS,
        duration: 50000,
      },
    ],
    links: [
      { label: "Jira", href: "https://jira.example.com/browse/MNG-3" },
      {
        label: "GitHub",
        href: "https://github.com/mongodb/mongo/releases/tag/v3",
      },
    ],
  },
  {
    releaseName: "mongotune-linux-bin-aarch64",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 600000,
      },
      {
        name: "Signed",
        status: ReleaseStepStatus.COMPLETED,
        duration: 5500000,
      },
      {
        name: "Private Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 2800000,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.COMPLETED,
        duration: 300000,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 7300000,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 950000,
      },
    ],
    links: [],
  },
  {
    releaseName: "mongotune-source-tarball",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 100000,
      },
      { name: "Signed", status: ReleaseStepStatus.NOT_STARTED, duration: 0 },
      {
        name: "Private Published",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
    ],
    links: [
      {
        label: "Download",
        href: "https://downloads.mongodb.org/src/mongo-src.tgz",
      },
    ],
  },
];

export const AtlasRelease: CustomStoryObj<typeof ReleaseViewCard> = {
  args: {
    releaseName: "Release v1.0.0",
    steps: [
      { name: "Fix", status: ReleaseStepStatus.COMPLETED, duration: 6000000 },
      {
        name: "Server Testing",
        status: ReleaseStepStatus.IN_PROGRESS,
        duration: 100,
      },
      {
        name: "Atlas End-to-End Testing",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Decision to Release",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      { name: "Rollout", status: ReleaseStepStatus.NOT_STARTED, duration: 0 },
    ],
    links: [
      { label: "Jira", href: "https://example.com" },
      { label: "GitHub", href: "https://example.com" },
    ],
  },
};

export const ReleaseWithSubRelease: CustomStoryObj<typeof ReleaseViewCard> = {
  args: {
    releaseName: "mongotune-release-1.2.3",
    steps: [
      { name: "Build", status: ReleaseStepStatus.COMPLETED, duration: 3000000 },
      { name: "Test", status: ReleaseStepStatus.COMPLETED, duration: 5000000 },
      { name: "Deploy", status: ReleaseStepStatus.IN_PROGRESS, duration: 1000 },
    ],
    links: [{ label: "Jira", href: "https://example.com" }],
    subRelease: releasesList,
  },
};

export const MongoSyncRelease: CustomStoryObj<typeof ReleaseViewCard> = {
  args: {
    releaseName: "mongotune-linux-bin-x86_64-amazon-2",
    steps: [
      {
        name: "Imported",
        status: ReleaseStepStatus.COMPLETED,
        duration: 600000,
      },
      {
        name: "Signed",
        status: ReleaseStepStatus.COMPLETED,
        duration: 5400000,
      },
      {
        name: "Private Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 2700000,
      },
      {
        name: "Allowed To Publish",
        status: ReleaseStepStatus.COMPLETED,
        duration: 300000,
      },
      {
        name: "Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 7200000,
      },
      {
        name: "Signature Published",
        status: ReleaseStepStatus.COMPLETED,
        duration: 900000,
      },
    ],
    links: [
      { label: "Jira", href: "https://example.com" },
      { label: "GitHub", href: "https://example.com" },
    ],
  },
};

export const SuperLongRelease: CustomStoryObj<typeof ReleaseViewCard> = {
  args: {
    releaseName: "Enterprise-Architected-Global-Scale-Release-v9000",
    steps: [
      {
        name: "Concept & Design",
        status: ReleaseStepStatus.COMPLETED,
        duration: 172800000,
      },
      {
        name: "Implementation",
        status: ReleaseStepStatus.COMPLETED,
        duration: 432000000,
      },
      {
        name: "Code Review",
        status: ReleaseStepStatus.COMPLETED,
        duration: 86400000,
      },
      {
        name: "Unit Testing",
        status: ReleaseStepStatus.COMPLETED,
        duration: 14400000,
      },
      {
        name: "Integration Testing",
        status: ReleaseStepStatus.COMPLETED,
        duration: 21600000,
      },
      {
        name: "Security Audit",
        status: ReleaseStepStatus.IN_PROGRESS,
        duration: 172800000,
      },
      {
        name: "Performance Tuning",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Beta Release",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
      {
        name: "Global Launch",
        status: ReleaseStepStatus.NOT_STARTED,
        duration: 0,
      },
    ],
    links: [
      { label: "Project Plan", href: "https://example.com/plan" },
      { label: "Architecture", href: "https://example.com/arch" },
    ],
  },
};

export const ReleasesCardList: CustomStoryObj<typeof ReleaseViewCard> = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {releasesList.map((release) => (
        <ReleaseViewCard key={release.releaseName} {...release} />
      ))}
    </div>
  ),
};
