import LoginPage from '../pages/LoginPage';
import SearchTicketsPage from '../pages/SearchTicketsPage';
import SelectSeatPage from '../pages/SelectSeatPage';
import VisitPage from '../pages/VisitPage';

describe('Select Seat', () => {
  beforeEach(() => {
    SearchTicketsPage.interceptTickets();
    SearchTicketsPage.interceptSearch();
    VisitPage.visitHomePage();
    SearchTicketsPage.fillAllInputs();
    SearchTicketsPage.clickSearchButton();
    SearchTicketsPage.selectTicket();
    SelectSeatPage.interceptReservedSeats();
  });

  it('Should select seat', () => {
    LoginPage.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    SearchTicketsPage.selectTicket();
    SelectSeatPage.selectSomeSeat('1');
  });
});
