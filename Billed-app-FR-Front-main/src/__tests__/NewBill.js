/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import mockStore from "../__mocks__/store"
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES , ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";
import userEvent from '@testing-library/user-event'

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the extension should be an allowed extension", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      let file = screen.getByTestId("file")
      
      file.name = "test.png"
      let path = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length);
      expect(path).toEqual("png")
    })

    test("Then the extension should be an allowed extension", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      let file = screen.getByTestId("file")
      
      file.name = "test.txt"
      let path = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length);
      expect(path).not.toEqual("png")
    })

    

    describe("post bills from an API" ,() => {
      

    test("post bills from an API ", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const data = {
          email : "a@a",
          type: 'achat',
          name: 'test',
          amount: "100",
          date: '2023-09-19',
          vat: 'example_vat',
          pct: 20,
         commentary: 'exemple',
         fileUrl: "test" ,
         fileName:"test.png" ,
         status: 'pending'
      };

      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: data.name } });

      expect(inputExpenseName.value).toBe(data.name);

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: data.amount } });

      expect(inputAmount.value).toBe(data.amount);

      let billForm = screen.getByTestId("form-new-bill");

      const localStorageMock = {
        getItem: jest.fn(() => JSON.stringify({ email: data.email })),

        setItem: jest.fn(),
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
      });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);

      billForm.addEventListener("submit" , handleSubmit);

      fireEvent.submit(billForm);

      expect(handleSubmit).toHaveBeenCalled();

     
    });
    test("file should change if the file extension is correct" , async() => {
      
      
      const html = NewBillUI()
      document.body.innerHTML = html
     
      class NewFile {
        async update({ data, headers = {} }) {
          return await "";
        }
        async create({ data, headers = {} }) {
          return await "";
        }
      }

      const input = screen.getByTestId("file");

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
      });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const Store = { bills: () => new NewFile() };
      const new_bill = new NewBill({
        document,
        onNavigate,
        store: Store,
        localStorage: window.localStorage,
      });
      const mockFile = new File(["mockfile"], "path/mockfile.png", {type: "image/png"});

      const handleChangeFile = jest.fn((e) =>
      new_bill.handleChangeFile(e)
      );

      const selectedFile = screen.getByTestId("file");
      selectedFile.addEventListener("change", handleChangeFile);
      userEvent.upload(selectedFile, mockFile);

      expect(selectedFile.files[0]).toStrictEqual(mockFile);
      expect(selectedFile.files.item(0)).toStrictEqual(mockFile);
      expect(selectedFile.files).toHaveLength(1);


    })

   
    

    })
  })
})
