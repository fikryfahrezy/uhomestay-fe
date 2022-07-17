import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, within, waitFor } from "./test-utils";
import OrgPeriod from "@/pages/dashboard/membership/org";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render organization period title", () => {
  render(<OrgPeriod />);

  const heading = screen.getByText("Periode Organisasi");

  expect(heading).toBeInTheDocument();
});

test("Render organization period list", async () => {
  render(<OrgPeriod />);

  const periodChip = await screen.findByTestId("period-chip");
  expect(periodChip).toBeInTheDocument();
});

test("Add new period success", async () => {
  render(<OrgPeriod />);

  const drwBtn = screen.getByTestId("period-drawer-btn");
  await user.click(drwBtn);

  const startPeriod = screen.getByLabelText("Awal Periode:");
  fireEvent.change(startPeriod, { target: { value: "2022-01-02" } });

  const endPeriod = screen.getByLabelText("Akhir Periode:");
  fireEvent.change(endPeriod, { target: { value: "2022-01-03" } });

  const orgStructBtn = screen.getByTestId("add-orgstruct-btn");
  await user.click(orgStructBtn);

  const drwOrgStruct = screen.getByTestId("drawer-org-struct");
  expect(drwOrgStruct).toHaveClass("test__drawer__open");

  const addStructForm = within(drwOrgStruct).getByTestId("add-struct-form");
  expect(addStructForm).toBeVisible();

  const selectComp = await screen.findByTestId("select-comp");
  await user.selectOptions(selectComp, "f79e82e8-c34a-4dc7-a49e-9fadc0979fda");

  const drwClose = within(drwOrgStruct).getByTestId("drawer-close-btn");
  await user.click(drwClose);

  expect(drwOrgStruct).not.toHaveClass("test__drawer__open");

  const orgGoalBtn = screen.getByTestId("add-goal-btn");
  await user.click(orgGoalBtn);

  const orgGoalSaveBtn = screen.getByTestId("org-goal-save-btn");
  expect(orgGoalSaveBtn).toBeInTheDocument();

  const leditorWrites = screen.getAllByTestId("lexical-editor-rich-write");
  await Promise.all(
    leditorWrites.map((leditorWrite) => user.type(leditorWrite, "test"))
  );

  await user.click(orgGoalSaveBtn);
  expect(orgGoalSaveBtn).not.toBeInTheDocument();

  const createBtn = screen.getByTestId("create-period-btn");
  await user.click(createBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Remove period success", async () => {
  render(<OrgPeriod />);

  const periodChip = await screen.findByTestId("period-chip");
  await user.click(periodChip);

  const editablePerBtn = screen.getByTestId("remove-period-btn");
  await user.click(editablePerBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});
