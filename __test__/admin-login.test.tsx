import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "./test-utils";
import AdminLogin from "@/pages/login/admin";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render welcome message", () => {
  render(<AdminLogin />);

  const heading = screen.getByRole("heading", {
    name: /Selamat Datang/i,
  });

  expect(heading).toBeInTheDocument();
});

test("Admin successfully login", async () => {
  render(<AdminLogin />);

  const idInput = screen.getByPlaceholderText("username");
  await user.type(idInput, "username");

  const pwInput = screen.getByPlaceholderText("*****");
  await user.type(pwInput, "password");

  const logBtn = screen.getByText("Login");
  await user.click(logBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();
});

test("Admin fail login without credentials", async () => {
  render(<AdminLogin />);

  const logBtn = screen.getByText("Login");
  await user.click(logBtn);

  const errMsgs = screen.getAllByText("Tidak boleh kosong");
  errMsgs.forEach((errMsg) => {
    expect(errMsg).toBeInTheDocument();
  });
});

test("Admin fail login without username", async () => {
  render(<AdminLogin />);

  const pwInput = screen.getByPlaceholderText("*****");
  await user.type(pwInput, "password");

  const logBtn = screen.getByText("Login");
  await user.click(logBtn);

  const errMsg = screen.getByText("Tidak boleh kosong");
  expect(errMsg).toBeInTheDocument();
});

test("Admin fail login without password", async () => {
  render(<AdminLogin />);

  const idInput = screen.getByPlaceholderText("username");
  await user.type(idInput, "username");

  const logBtn = screen.getByText("Login");
  await user.click(logBtn);

  const errMsg = screen.getByText("Tidak boleh kosong");
  expect(errMsg).toBeInTheDocument();
});
