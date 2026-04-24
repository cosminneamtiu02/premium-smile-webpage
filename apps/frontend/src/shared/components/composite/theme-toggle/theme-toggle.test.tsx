import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { THEMES, useThemeStore } from "@/stores/theme-store";
import { renderWithProviders } from "@/test-utils";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "light" });
  });

  it("cycles through themes on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(useThemeStore.getState().theme).toBe("light");
    await user.click(button);
    expect(useThemeStore.getState().theme).toBe(THEMES[1]);
    await user.click(button);
    expect(useThemeStore.getState().theme).toBe(THEMES[2]);
    await user.click(button);
    expect(useThemeStore.getState().theme).toBe(THEMES[0]);
  });

  it("has an accessible label", () => {
    renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAccessibleName();
  });
});
