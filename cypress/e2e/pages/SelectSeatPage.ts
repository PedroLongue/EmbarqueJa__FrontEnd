/// <reference types="cypress" />

class SelectSeat {
  interceptReservedSeats() {
    cy.fixture('tickets').then((data) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/tickets/mocked-ticket-id',
        {
          statusCode: 200,
          body: data[0],
        },
      ).as('getTickets');
    });
  }

  interceptPostReservation() {
    cy.intercept('POST', 'http://localhost:3000/api/tickets/reservations', {
      statusCode: 200,
      body: {
        _id: 'mocked-reservation-id',
        userId: 'mocked-user-id',
        ticketId: 'mocked-ticket-id',
        seats: [1],
        status: 'pending',
      },
    }).as('postReservation');
  }

  interceptGetReservations() {
    cy.intercept('GET', '**/api/tickets/reservations/**', {
      statusCode: 200,
      body: {
        _id: 'mocked-reservation-id',
        userId: 'qualquer-user-id',
        ticketId: 'mocked-ticket-id',
        seats: [1],
        status: 'pending',
      },
    }).as('getReservation');
  }

  selectSomeSeat(seatNumber: string) {
    cy.get(`[data-testid="seat-${seatNumber}"]`).click();
    cy.get('[data-testid="modal-seat"]').scrollTo('bottom');
    cy.get('[data-testid="selected-seats"]').should('be.visible');
  }

  confirmSeat() {
    cy.get('[data-testid="confirm-seats-button"]').click();
    cy.wait('@postReservation');
    cy.wait('@getReservation');
  }
}

export default new SelectSeat();
