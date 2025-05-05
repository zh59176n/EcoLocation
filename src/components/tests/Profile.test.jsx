import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import ProfilePage from "../Profile";
import { MemoryRouter } from "react-router-dom";

describe("ProfilePage accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
