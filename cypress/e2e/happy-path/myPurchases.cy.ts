import LoginPage from '../pages/LoginPage';
import MyPurchasesPage from '../pages/MyPurchasesPage';
import SelectSeatPage from '../pages/SelectSeatPage';
import VisitPage from '../pages/VisitPage';

describe('My Purchases', () => {
  beforeEach(() => {
    VisitPage.visitLoginPage();
    LoginPage.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
  });

  it("should display the user's purchases page", () => {
    MyPurchasesPage.myPurchase();
    SelectSeatPage.interceptReservedSeats();
  });
});
