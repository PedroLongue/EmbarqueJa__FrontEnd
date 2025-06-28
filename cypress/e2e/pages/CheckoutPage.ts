/// <reference types="cypress" />

class CheckoutPage {
  interceptDeleteReservation() {
    cy.intercept(
      'DELETE',
      'http://localhost:3000/api/tickets/reservations/mocked-reservation-id',
      {
        statusCode: 200,
      },
    ).as('deleteReservation');
  }

  interceptConfirmReservation() {
    cy.intercept(
      'PATCH',
      'http://localhost:3000/api/tickets/reservations/mocked-reservation-id/confirm',
      {
        statusCode: 200,
        body: {
          _id: 'mocked-reservation-id',
          userId: 'mocked-user-id',
          ticketId: 'mocked-ticket-id',
          seats: [1],
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          __v: 0,
        },
      },
    ).as('confirmReservation');
  }

  fillPassangerFields() {
    cy.get('[data-testid="passanger-input-name"]').type('Teste');
    cy.get('[data-testid="passanger-input-cpf"]').type('12345678901');
    cy.get('[data-testid="passanger-input-birthdate"]').type('13092001');
  }

  goToPayment() {
    cy.get('[data-testid="boarding-pass-go-to-payment-button"]').click();
  }

  buyByCreditCard() {
    cy.get('[data-testid="input-card-number"]').type('1234567890123456');
    cy.get('[data-testid="input-card-name"]').type('Teste');
    cy.get('[data-testid="input-card-expiry"]').type('12/25');
    cy.get('[data-testid="input-card-cvv"]').type('123');
    cy.get('[data-testid="checkbox-terms"]').click({ force: true });

    cy.get('[data-testid="button-confirm-payment"]').click();
  }

  buyByPix() {
    cy.get('[data-testid="tab-pix"]').click();
    cy.get('[data-testid="confirm-pix-payment"]').click();
    cy.wait(3000);
    cy.get('[data-testid="checkbox-terms"]').click({ force: true });

    cy.get('[data-testid="button-confirm-payment"]').click();
  }

  cancelReservation() {
    cy.get('[data-testid="boarding-pass-cancel-reservation-button"]').click();
    cy.wait('@deleteReservation').its('response.statusCode').should('eq', 200);
  }
}

export default new CheckoutPage();
