/// <reference types="cypress" />

const TEST_EMAIL = "smoke@ecolocation.test";
const TEST_PW    = "SmokeTest123!";

describe("EcoLocation Core Smoke Test", () => {
  before(() => {
    // Ensure our test account exists
    cy.request({
      method: "POST",
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${Cypress.env("FIREBASE_API_KEY")}`,
      failOnStatusCode: false, // ignore if already there
      body: { email: TEST_EMAIL, password: TEST_PW, returnSecureToken: true }
    });
  });

  it("logs in and exercises all primary pages", () => {
    // ─── 1) LOGIN ─────────────────────────────────────────────────────────────
    cy.visit("/login");
    cy.get("input[type=email]").type(TEST_EMAIL);
    cy.get("input[type=password]").type(TEST_PW);
    cy.get("button[type=submit]").click();
    cy.url().should("not.include", "/login");

    // ─── 2) CARBON CALCULATOR ─────────────────────────────────────────────────
    cy.visit("/carbon");
    cy.get("#commute").should("exist").type("10");
    cy.get("#energy").type("5");
    cy.get("#airMiles").type("100");
    cy.get("button[type=submit]").click();
    cy.contains(/kg/i).should("exist");

    // ─── 3) CHALLENGES ─────────────────────────────────────────────────────────
    cy.visit("/challenges");
    cy.contains("✅ Progress:").should("exist");
    // mark the first day
    cy.get("button[title='Click to mark this day']").first().click();
    cy.contains(/days completed/i).should("exist");

    // ─── 4) SOLAR/EV PROVIDERS ────────────────────────────────────────────────
    cy.visit("/solar");
    cy.contains("Nearby EV Charging Stations").should("exist");
    // at least one "View on Map" button
    cy.get("button").contains("View on Map").should("have.length.at.least", 1);

    // ─── 5) ABOUT ──────────────────────────────────────────────────────────────
    cy.visit("/about");
    cy.contains("Track Your Green Actions").should("exist");
    // ensure at least one team avatar
    cy.get("img[alt]").should("have.length.at.least", 1);
  });
});