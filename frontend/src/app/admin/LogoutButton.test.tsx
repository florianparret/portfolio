import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LogoutButton } from "./LogoutButton";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

const logoutMock = vi.fn();

vi.mock("@/lib/api", () => ({
  logout: () => logoutMock(),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    logoutMock.mockReset();
  });

  it("appelle logout() puis redirige vers /admin/login", async () => {
    logoutMock.mockResolvedValue(undefined);
    render(<LogoutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Se déconnecter" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin/login"));
    expect(logoutMock).toHaveBeenCalled();
  });
});
