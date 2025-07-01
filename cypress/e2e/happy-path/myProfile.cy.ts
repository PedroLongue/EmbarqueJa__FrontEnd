import LoginPage from '../pages/LoginPage';
import MyProfilePage from '../pages/MyProfilePage';
import SelectSeatPage from '../pages/SelectSeatPage';
import VisitPage from '../pages/VisitPage';

describe('My Profile', () => {
  beforeEach(() => {
    VisitPage.visitLoginPage();
    LoginPage.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
  });

  it("should display the user's profile page", () => {
    MyProfilePage.myProfile();
    SelectSeatPage.interceptReservedSeats();
  });
});
