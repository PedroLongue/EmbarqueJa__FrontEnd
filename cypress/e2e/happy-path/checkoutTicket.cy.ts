import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';
import SearchTicketsPage from '../pages/SearchTicketsPage';
import SelectSeatPage from '../pages/SelectSeatPage';
import VisitPage from '../pages/VisitPage';

describe('Buy a Ticket', () => {
  beforeEach(() => {
    SearchTicketsPage.interceptTickets();
    SearchTicketsPage.interceptSearch();

    VisitPage.visitHomePage();
    SearchTicketsPage.fillAllInputs();
    SearchTicketsPage.clickSearchButton();
    SearchTicketsPage.selectTicket();
    LoginPage.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    SearchTicketsPage.selectTicket();
    SelectSeatPage.selectSomeSeat('1');

    SelectSeatPage.interceptReservedSeats();
    SelectSeatPage.interceptPostReservation();
    SelectSeatPage.interceptGetReservations();

    SelectSeatPage.confirmSeat();

    CheckoutPage.fillPassangerFields();
  });

  it('should be able to cancel reservation', () => {
    CheckoutPage.interceptDeleteReservation();
    CheckoutPage.cancelReservation();
  });

  it('should be able to go to payment page by credit card', () => {
    CheckoutPage.goToPayment();
    CheckoutPage.interceptConfirmReservation();
    CheckoutPage.buyByCreditCard();
    cy.wait('@confirmReservation').its('response.statusCode').should('eq', 200);
  });

  it('should be able to go to payment page by pix', () => {
    CheckoutPage.goToPayment();
    CheckoutPage.interceptConfirmReservation();
    CheckoutPage.buyByPix();
    cy.wait('@confirmReservation').its('response.statusCode').should('eq', 200);
  });
});
