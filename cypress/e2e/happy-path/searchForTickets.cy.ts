import SearchTicketsPage from '../pages/SearchTicketsPage';
import VisitPage from '../pages/VisitPage';

describe('Search for tickets', () => {
  beforeEach(() => {
    SearchTicketsPage.interceptTickets();
    SearchTicketsPage.interceptSearch();
    VisitPage.visitHomePage();
  });

  it('Should be able to search for a trip', () => {
    SearchTicketsPage.fillAllInputs();
    SearchTicketsPage.clickSearchButton();
  });
});
