const testEmail = 'test@example.com'; // ✅ Replace with valid test email
const testPassword = 'password123';   // ✅ Replace with valid test password

describe('🌱 EcoLocation Smoke Test', () => {
  it('logs in, uses calculator, tracks challenge, and fetches news', () => {
    // Login
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);
    cy.contains('Log In').click();

    // Wait for redirect
    cy.url().should('not.include', '/login');

    // Carbon Calculator
    cy.visit('http://localhost:5173/calculator');
    cy.contains('Carbon Footprint Calculator').should('exist');

    // Challenge Tracker
    cy.visit('http://localhost:5173/challenges');
    cy.contains('Eco Challenge Tracker').should('exist');

    // News Feed
    cy.visit('http://localhost:5173/news');
    cy.contains('🌿 Eco News Feed').should('exist');
  });
});
