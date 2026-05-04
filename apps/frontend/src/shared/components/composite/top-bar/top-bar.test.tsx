import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { TopBar } from "./top-bar";

const ITEMS = [
  { key: "home", label: "Home" },
  { key: "pricing", label: "Pricing" },
];

describe("TopBar", () => {
  it("invokes onNavigate with the clicked item key", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderWithProviders(<TopBar items={ITEMS} activeKey="home" onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Pricing" }));
    expect(onNavigate).toHaveBeenCalledWith("pricing");
  });

  it("invokes onBook when the CTA is clicked", async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    renderWithProviders(<TopBar items={ITEMS} bookLabel="Book Now" onBook={onBook} />);
    await user.click(screen.getByRole("button", { name: "Book Now" }));
    expect(onBook).toHaveBeenCalledTimes(1);
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TopBar items={ITEMS} />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marks the active item with aria-current='page'", () => {
    renderWithProviders(<TopBar items={ITEMS} activeKey="pricing" />);
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("renders the CTA inside the open mobile menu and closes it on click", async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    renderWithProviders(<TopBar items={ITEMS} bookLabel="Book Now" onBook={onBook} />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const dialog = screen.getByRole("dialog");
    const dropdownBook = within(dialog).getByRole("button", { name: "Book Now" });

    await user.click(dropdownBook);
    expect(onBook).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
