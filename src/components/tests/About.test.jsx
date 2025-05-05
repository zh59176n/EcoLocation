import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import About from "../About";
import { MemoryRouter } from "react-router-dom";

describe("About accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
