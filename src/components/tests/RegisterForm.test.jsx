import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import RegisterForm from "../RegisterForm";
import { MemoryRouter } from "react-router-dom";

describe("RegisterForm accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
