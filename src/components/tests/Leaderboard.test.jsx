import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Leaderboard from "../Leaderboard";
import { MemoryRouter } from "react-router-dom";

describe("Leaderboard accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Leaderboard
          weekStart={new Date()}
          user={{ uid: "test", email: "test@example.com" }}
          completedDays={3}
        />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
