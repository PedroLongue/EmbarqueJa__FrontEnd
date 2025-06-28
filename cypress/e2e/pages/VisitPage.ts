/// <reference types="cypress" />

class VisitPage {
  visitHomePage() {
    cy.visit('/');
  }

  visitLoginPage() {
    cy.visit('/login');
  }

  visitRegisterPage() {
    cy.visit('/register');
  }
}

export default new VisitPage();
