import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import Cashflow from "@/pages/dashboard/finance";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render some text", () => {
  render(<Cashflow />);

  const heading = screen.getByText("Buat Transaksi");
  expect(heading).toBeInTheDocument();
});

test("Render income list", async () => {
  render(<Cashflow />);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).not.toHaveClass("test__outcome__color");
  expect(item).toHaveClass("test__income__color");
});

test("Render income list", async () => {
  render(<Cashflow />);

  const outcomeTabBtn = screen.getByTestId("outcome-tab-btn");
  await user.click(outcomeTabBtn);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).toHaveClass("test__outcome__color");
  expect(item).not.toHaveClass("test__income__color");
});

test("Admin successfully add income transaction", async () => {
  render(<Cashflow />);

  const addBtn = screen.getByTestId("add-transaction-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const dateInput = screen.getByLabelText("Tanggal:");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const typeInput = screen.getByLabelText("Tipe:");
  await user.selectOptions(typeInput, "income");

  const svBtn = screen.getByTestId("add-cashflow-btn");
  await user.click(svBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin successfully add outcome transaction", async () => {
  render(<Cashflow />);

  const addBtn = screen.getByTestId("add-transaction-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const dateInput = screen.getByLabelText("Tanggal:");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const typeInput = screen.getByLabelText("Tipe:");
  await user.selectOptions(typeInput, "outcome");

  const svBtn = screen.getByTestId("add-cashflow-btn");
  await user.click(svBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin successfully edit income transaction", async () => {
  render(<Cashflow />);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).not.toHaveClass("test__outcome__color");
  expect(item).toHaveClass("test__income__color");

  const listBtn = screen.getByTestId("cashflow-item-btn");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("editable-cashflow-btn");
  await user.click(editableButtn);

  const dateInput = screen.getByLabelText("Tanggal:");
  expect(dateInput).not.toHaveAttribute("readonly");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const typeInput = screen.getByLabelText("Tipe:");
  expect(typeInput).toBeEnabled();
  await user.selectOptions(typeInput, "income");

  const editButtn = screen.getByTestId("edit-cashflow-btn");
  await user.click(editButtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin successfully edit outcome transaction", async () => {
  render(<Cashflow />);

  const outcomeTabBtn = screen.getByTestId("outcome-tab-btn");
  await user.click(outcomeTabBtn);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).toHaveClass("test__outcome__color");
  expect(item).not.toHaveClass("test__income__color");

  const listBtn = screen.getByTestId("cashflow-item-btn");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("editable-cashflow-btn");
  await user.click(editableButtn);

  const dateInput = screen.getByLabelText("Tanggal:");
  expect(dateInput).not.toHaveAttribute("readonly");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const typeInput = screen.getByLabelText("Tipe:");
  await user.selectOptions(typeInput, "outcome");

  const editButtn = screen.getByTestId("edit-cashflow-btn");
  await user.click(editButtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin successfully remove income transaction", async () => {
  render(<Cashflow />);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).not.toHaveClass("test__outcome__color");
  expect(item).toHaveClass("test__income__color");

  const listBtn = screen.getByTestId("cashflow-item-btn");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("remove-cashflow-btn");
  await user.click(editableButtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});

test("Admin successfully remove outcome transaction", async () => {
  render(<Cashflow />);

  const outcomeTabBtn = screen.getByTestId("outcome-tab-btn");
  await user.click(outcomeTabBtn);

  const item = await screen.findByTestId("cashflow-item");
  expect(item).toHaveClass("test__outcome__color");
  expect(item).not.toHaveClass("test__income__color");

  const listBtn = screen.getByTestId("cashflow-item-btn");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("cashflow-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("remove-cashflow-btn");
  await user.click(editableButtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});
