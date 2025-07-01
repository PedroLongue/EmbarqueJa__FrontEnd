/// <reference types="cypress" />

class MyProfilePage {
  myProfile() {
    cy.get('[data-testid="user-menu-button"]').click();
    cy.get('[data-testid="my-profile-menu-item"]').click();

    cy.get('[data-testid="my-profile-title"]').should('be.visible');
  }
}

export default new MyProfilePage();
