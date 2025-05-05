import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";
import { MemoryRouter } from "react-router-dom";

describe("Navbar accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("allows tab navigation to reach Home link", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: /home/i });

    // Simulate tabbing until the Home link is focused
    let maxTabs = 10;
    while (document.activeElement !== homeLink && maxTabs > 0) {
      await userEvent.tab();
      maxTabs--;
    }

    expect(homeLink).toHaveFocus();
  });
});
