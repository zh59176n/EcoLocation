import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Home from "../Home";
import { MemoryRouter } from "react-router-dom";

describe("Home accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
