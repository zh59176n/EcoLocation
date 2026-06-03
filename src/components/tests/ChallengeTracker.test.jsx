import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import ChallengeTracker from "../ChallengeTracker";
import { MemoryRouter } from "react-router-dom";

describe("EcoChallengeTracker accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <ChallengeTracker />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
