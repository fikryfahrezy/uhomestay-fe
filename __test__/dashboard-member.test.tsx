import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "./test-utils";
import MemberPage from "@/pages/dashboard/membership";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render welcome message", () => {
  render(<MemberPage />);

  const heading = screen.getByText("Anggota");

  expect(heading).toBeInTheDocument();
});

test("Admin successfully add member", async () => {
  render(<MemberPage />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const usernameInput = screen.getByLabelText("Username:");
  await user.type(usernameInput, "username");

  const passwordInput = screen.getByLabelText("Password:");
  await user.type(passwordInput, "password");

  const nameInput = screen.getByLabelText("Nama:");
  await user.type(nameInput, "name");

  const waPhoneInput = screen.getByLabelText("Nomor WA:");
  await user.type(waPhoneInput, "00000000");

  const otherPhoneInput = screen.getByLabelText("Nomor Lainnya:");
  await user.type(otherPhoneInput, "00000000");

  const orgPeriodInput = screen.getByLabelText("Periode Organisasi:");
  expect(orgPeriodInput).toBeEnabled();
  await user.selectOptions(orgPeriodInput, "1");

  const dynamicSelectBtn = screen.getByTestId("dynamic-select-btn");
  await user.click(dynamicSelectBtn);

  const selectComp = (await screen.findAllByTestId("select-comp"))[1];
  expect(selectComp).toBeEnabled();
  await user.selectOptions(selectComp, "1");

  const submitBtn = screen.getByTestId("submit-member-btn");
  await user.click(submitBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();
});
