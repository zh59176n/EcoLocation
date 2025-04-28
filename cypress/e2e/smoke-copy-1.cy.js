/// <reference types="cypress" />

describe("EcoLocation Smoke Test", () => {
  it("can log in, calculate carbon, complete a challenge, and load news", () => {
    // 1. Visit login page and sign in
    cy.visit("/login");
    cy.get("input[type=email]").type("testuser@example.com");
    cy.get("input[type=password]").type("testpassword");
    cy.get("button[type=submit]").click();

    // 2. Verify redirect to home (or dashboard)
    cy.url().should("not.include", "/login");

    // 3. Carbon Calculators
    cy.visit("/carbon");
    cy.get("input#commute").type("10");
    cy.get("input#energy").type("5");
    cy.get("input#airMiles").type("100");
    cy.get("button[type=submit]").click();
    cy.contains(/kg/i).should("exist");

    // 4. Challenges page
    cy.visit("/challenges");
    cy.get("button[title*='Click to mark this day']").first().click();
    cy.contains(/progress: \d\/7/i).should("exist");

    // 5. Newsfeed
    cy.visit("/news");
    cy.contains("Eco-Friendly Newsfeed").should("exist");
    cy.get("article").its("length").should("be.gte", 1);
  });
});