/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor} from "@testing-library/dom"
import {userEvent} from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from '../containers/Bills.js';

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //test class
      
      

      //#7bb1f7;

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("if i click on the new bills button" ,  () => {
      test("then it should  open new bills page" , async ()=> {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      
      window.onNavigate(ROUTES_PATH.Bills)

      let Button = screen.getByTestId("btn-new-bill");
      fireEvent.click(Button);
      await waitFor(() => screen.getByTestId('expense-type'))
      let e = screen.getByTestId('expense-type');
      expect(e).toBeTruthy()
      })
    })

    describe("if i click on eye-icon" , () =>{
      test("it should open bills in a modal", async () =>{
        

// Override jQuery modal function
      // Necessary for testing
      $.fn.modal = jest.fn(() => {
        const modal = screen.getByTestId("modaleFile")
        modal.classList.add("show")
        modal.style.display = "block"
      })

      // initialize Bills with fixtures
      const billsContainer = new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      // setup html elements
      document.body.innerHTML = BillsUI({ data: bills })

      // get Eye icon
      const icon = screen.getAllByTestId("icon-eye")[0]

      // set up eye icon event listener
      const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(icon))
      icon.addEventListener("click", handleClickIconEye)

      // user click on eye icon
      fireEvent.click(icon)

      // event listener should be called
      expect(handleClickIconEye).toHaveBeenCalled()

      // modal should be displayed
      expect(screen.getAllByText("Justificatif")).toBeTruthy()
      



      })
    })
  })
})
