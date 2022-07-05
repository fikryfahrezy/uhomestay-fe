import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import MemberDues from "@/pages/dashboard/finance/dues/member/[id]";

// https://github.com/vercel/next.js/issues/7479#issuecomment-568431869
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {
        id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
      },
      asPath: "",
      replace: jest.fn(),
    };
  },
}));

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render text in page", async () => {
  render(<MemberDues />);

  const text = await screen.findByText("Nomor WA");
  expect(text).toBeInTheDocument();
});

test("Edit member dues success", async () => {
  render(<MemberDues />);

  const duesBtn = await screen.findByTestId("member-dues-item-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("member-dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const editableBtn = screen.getByTestId("editable-member-dues-btn");
  await user.click(editableBtn);

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const proveInput = await screen.findByTestId("input-file-field-comp");
  expect(proveInput).toBeInTheDocument();
  await user.upload(proveInput, file);

  const editBtn = screen.getByTestId("edit-member-dues-btn");
  await user.click(editBtn);

  await waitFor(() => {
    expect(
      screen.queryByText("Tidak boleh kosong")
    ).not.toBeInTheDocument();
  });
});

test("Approve member dues payment success", async () => {
  render(<MemberDues />);

  const duesBtn = await screen.findByTestId("member-dues-item-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("member-dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const editBtn = screen.getByTestId("approve-paid-btn");
  await user.click(editBtn);

  await waitFor(() => {
    expect(
      screen.queryByText("Tidak boleh kosong")
    ).not.toBeInTheDocument();
  });
});
