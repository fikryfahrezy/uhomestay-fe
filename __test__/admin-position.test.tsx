import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import Position from "@/pages/dashboard/membership/position";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render welcome message", () => {
  render(<Position />);

  const heading = screen.getByText("Jabatan Tersedia");

  expect(heading).toBeInTheDocument();
});

// Add

test("Admin successfully add position", async () => {
  render(<Position />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const posInput = screen.getByLabelText("Posisi:");
  await user.type(posInput, "Posisi:");

  const selectComp = screen.getByTestId("select-comp");
  await user.selectOptions(selectComp, "1");

  const svBtn = screen.getByTestId("save-btn");
  await user.click(svBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin fail add position without level", async () => {
  const spy = jest.spyOn(require("@/services/position"), "addPosition");
  render(<Position />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const posInput = screen.getByLabelText("Posisi:");
  await user.type(posInput, "Posisi:");

  const svBtn = screen.getByTestId("save-btn");
  await user.click(svBtn);

  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

test("Admin successfully cancel add position", async () => {
  render(<Position />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const cnclBtn = screen.getByTestId("cancel-btn");
  await user.click(cnclBtn);

  expect(docDrawer).not.toHaveClass("test__drawer__open");
});

// Delete

test("Admin successfully remove position", async () => {
  render(<Position />);

  const listBtn = await screen.findByTestId("position-list-item");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const delBtn = screen.getByTestId("position-remove-btn");
  await user.click(delBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});

test("Admin cancel remove position", async () => {
  render(<Position />);

  const listBtn = await screen.findByTestId("position-list-item");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const delBtn = screen.getByTestId("position-remove-btn");
  await user.click(delBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-n-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});

// Update

test("Admin successfully edit position", async () => {
  render(<Position />);

  const listBtn = await screen.findByTestId("position-list-item");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("editable-position-btn");
  await user.click(editableButtn);

  const posInput = screen.getByLabelText("Posisi:");
  expect(posInput).not.toHaveAttribute("readonly");
  await user.type(posInput, "Posisi:");

  const selectComp = screen.getByTestId("select-comp");
  expect(selectComp).toBeEnabled();
  await user.selectOptions(selectComp, "1");

  const editButtn = screen.getByTestId("edit-position-btn");
  await user.click(editButtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin fail edit position without position", async () => {
  const spy = jest.spyOn(require("@/services/position"), "editPosition");
  render(<Position />);

  const listBtn = await screen.findByTestId("position-list-item");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("editable-position-btn");
  await user.click(editableButtn);

  const posInput = screen.getByTestId("edit-position-name-field");
  await user.clear(posInput);

  const editButtn = screen.getByTestId("edit-position-btn");
  await user.click(editButtn);

  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

test("Admin cancel edit position", async () => {
  render(<Position />);

  const listBtn = await screen.findByTestId("position-list-item");
  await user.click(listBtn);

  const docDrawer = screen.getByTestId("position-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editableButtn = screen.getByTestId("editable-position-btn");
  await user.click(editableButtn);

  const cancelEdit = screen.getByTestId("cancel-edit-position-btn");
  await user.click(cancelEdit);

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});
