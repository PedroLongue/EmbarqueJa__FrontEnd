import LoginPage from "../pages/LoginPage"
import SearchTickets from "../pages/SearchTickets"
import SelectSeat from "../pages/SelectSeat"
import VisitPage from "../pages/VisitPage"

describe('Select Seat', () => {
    beforeEach(() => {
        SearchTickets.interceptTickets()
        SearchTickets.interceptSearch()
        VisitPage.visitHomePage()
        SearchTickets.fillAllInputs()
        SearchTickets.clickSearchButton()
        SearchTickets.selectTicket()
    })
    
    it('Should select seat', () => {
        LoginPage.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'))
        SearchTickets.selectTicket()
        SelectSeat.selectSomeSeat('1')
    })
})