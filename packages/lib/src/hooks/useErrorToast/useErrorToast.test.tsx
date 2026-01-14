import { ApolloError } from "@apollo/client";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { MockedProvider, renderHook } from "test_utils";
import { useErrorToast } from ".";

const Provider = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[]}>{children}</MockedProvider>
);

describe("useErrorToast", () => {
  it("should not show toast when there is no error", () => {
    const { dispatchToast } = RenderFakeToastContext();

    renderHook(() => useErrorToast(undefined, "Unable to load data"), {
      wrapper: Provider,
    });

    expect(dispatchToast.error).not.toHaveBeenCalled();
  });

  it("should show toast when there is an error", () => {
    const { dispatchToast } = RenderFakeToastContext();
    const error = new ApolloError({ errorMessage: "Network error" });

    renderHook(() => useErrorToast(error, "Unable to load data"), {
      wrapper: Provider,
    });

    expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    expect(dispatchToast.error).toHaveBeenCalledWith(
      "Unable to load data: Network error",
    );
  });

  it("should not show duplicate toasts for the same error", () => {
    const { dispatchToast } = RenderFakeToastContext();
    const error = new ApolloError({ errorMessage: "Network error" });

    const { rerender } = renderHook(
      () => useErrorToast(error, "Unable to load data"),
      {
        wrapper: Provider,
      },
    );

    // Re-render with the same error
    rerender();
    rerender();

    expect(dispatchToast.error).toHaveBeenCalledTimes(1);
  });

  it("should show new toast when error changes", () => {
    const { dispatchToast } = RenderFakeToastContext();
    const error1 = new ApolloError({ errorMessage: "Network error" });
    const error2 = new ApolloError({ errorMessage: "Server error" });

    const { rerender } = renderHook(
      ({ error }) => useErrorToast(error, "Unable to load data"),
      {
        wrapper: Provider,
        initialProps: { error: error1 },
      },
    );

    expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    expect(dispatchToast.error).toHaveBeenLastCalledWith(
      "Unable to load data: Network error",
    );

    // Re-render with a different error
    rerender({ error: error2 });

    expect(dispatchToast.error).toHaveBeenCalledTimes(2);
    expect(dispatchToast.error).toHaveBeenLastCalledWith(
      "Unable to load data: Server error",
    );
  });

  it("should allow new toast after error is cleared and reoccurs", () => {
    const { dispatchToast } = RenderFakeToastContext();
    const error = new ApolloError({ errorMessage: "Network error" });

    const { rerender } = renderHook<void, { err: ApolloError | undefined }>(
      ({ err }) => useErrorToast(err, "Unable to load data"),
      {
        wrapper: Provider,
        initialProps: { err: error },
      },
    );

    expect(dispatchToast.error).toHaveBeenCalledTimes(1);

    // Clear the error
    rerender({ err: undefined });

    // Same error occurs again
    rerender({ err: error });

    expect(dispatchToast.error).toHaveBeenCalledTimes(2);
  });
});
