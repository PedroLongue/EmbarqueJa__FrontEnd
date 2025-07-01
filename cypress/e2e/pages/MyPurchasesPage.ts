/// <reference types="cypress" />

class MyPurchasesPage {
  myPurchase() {
    cy.get('[data-testid="user-menu-button"]').click();
    cy.get('[data-testid="my-purchases-menu-item"]').click();

    cy.get('[data-testid="my-purchases-title"]').should('be.visible');
  }
}

export default new MyPurchasesPage();
