class SelectSeat {
    selectSomeSeat(seatNumber: string) {
        cy.get(`[data-testid="seat-${seatNumber}"]`).click();
    }
}

export default new SelectSeat()