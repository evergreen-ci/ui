import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RenderFakeToastContext as InitializeFakeToastContext } from "context/toast/__mocks__";
import {
  sectionStateAllClosed,
  sectionStateAllOpen,
  sectionStateSomeOpen,
} from "hooks/useSections/testData";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { SectionControls } from "./SectionControls";

const wrapper = logContextWrapper();

describe("SectionControls", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("Should not render 'Open all sections' and should render when all sections are open", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.ddd
      sectioning: {
        sectionState: sectionStateAllOpen,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeNull();
    expect(screen.queryByText("Close all sections")).toBeVisible();
  });
  it("Should not render 'Close all sections' and should render when all sections are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateAllClosed,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeVisible();
    expect(screen.queryByText("Close all sections")).toBeNull();
  });
  it("Should not render any buttons when sectioning is disabled", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateAllClosed,
        sectioningEnabled: false,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeNull();
    expect(screen.queryByText("Close all sections")).toBeNull();
  });
  it("Should render 'Open all sections' and 'Close all sections' buttons when some sections are open and some are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeVisible();
    expect(screen.queryByText("Close all sections")).toBeVisible();
  });

  it("Clicking on buttons calls 'toggleAllSections' with correct parameters", async () => {
    const user = userEvent.setup();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const toggleAllSectionsMock = vi.fn();
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllSections: toggleAllSectionsMock,
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.getByDataCy("open-all-sections-btn")).toBeVisible();
    await user.click(screen.getByDataCy("open-all-sections-btn"));
    expect(toggleAllSectionsMock).toHaveBeenCalledOnce();
    await user.click(screen.getByDataCy("close-all-sections-btn"));
    await waitFor(() =>
      expect(toggleAllSectionsMock).toHaveBeenCalledWith(false),
    );
  });
});
