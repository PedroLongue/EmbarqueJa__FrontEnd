/// <reference types="cypress" />

class LoginPage {
  fillEmail(email: string) {
    cy.get('[data-testid="login-input-email"]').type(email);
  }

  fillPassword(password: string) {
    cy.get('[data-testid="login-input-password"]').type(password, {
      log: false,
    });
  }

  submit() {
    cy.get('[data-testid="button-login"]').click();
  }

  login(email: string, password: string) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }
}

export default new LoginPage();
