class SearchTickets {
    interceptTickets() {
        cy.fixture('tickets').then((data) => {
            cy.intercept('GET', 'http://localhost:3000/api/tickets', {
                statusCode: 200,
                body: data
            }).as('getTickets')
        })
    }

    interceptSearch() {
        cy.fixture('searchTickets').then((data) => {
            cy.intercept('GET', /\/api\/tickets\/search.*/, {
                statusCode: 200,
                body: data
            }).as('searchTickets')
        })
    }

    fillAllInputs() {
        cy.wait('@getTickets')
        cy.get('[data-testid="input-origin"]').type('Nova Friburgo')
        cy.get('[data-testid="input-destination"]').type('Rio de Janeiro')
        cy.get('[data-testid="input-trip-date"]').type('2050-12-31') 
    }

    clickSearchButton() {
        cy.get('[data-testid="button-trip-search"]').click()
        cy.wait('@searchTickets')
        cy.get('[data-testid="tickets-found"]').should('be.visible')
    }

    selectTicket() {
        cy.get('[data-testid="select-ticket-button"]').click()
    }
}

export default new SearchTickets()
