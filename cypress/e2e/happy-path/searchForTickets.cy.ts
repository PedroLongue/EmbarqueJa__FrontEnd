import SearchTickets from "../pages/SearchTickets"
import VisitPage from "../pages/VisitPage"

describe('Search for tickets', () => {
  beforeEach(() => {
    SearchTickets.interceptTickets()
    SearchTickets.interceptSearch()
    VisitPage.visitHomePage()
  })

  it('Should be able to search for a trip', () => {
    SearchTickets.fillAllInputs()
    SearchTickets.clickSearchButton()
  })
})
