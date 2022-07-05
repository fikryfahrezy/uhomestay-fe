import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import Dues from "@/pages/dashboard/finance/dues";
import { server } from "../__mocks__/server";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render text in page", async () => {
  render(<Dues />);

  const text = await screen.findByText("Daftar Iuran Anggota");

  expect(text).toBeInTheDocument();
});

test("Admin successfully add dues", async () => {
  render(<Dues />);

  const duesBtn = await screen.findByTestId("add-dues-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const dateInput = screen.getByLabelText("Tanggal:");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const nominalInput = screen.getByLabelText("Jumlah:");
  await user.type(nominalInput, "123");

  const createBtn = screen.getByTestId("create-dues-btn");
  await user.click(createBtn);

  expect(screen.queryByText("Tidak boleh kosong")).not.toBeInTheDocument();
});

test("Admin successfully edit dues", async () => {
  render(<Dues />);

  const selectDues = await screen.findByTestId("select-comp");
  expect(selectDues).toBeInTheDocument();

  const duesBtn = await screen.findByTestId("option-dues-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const editableBtn = await screen.findByTestId("editable-dues-btn");
  await user.click(editableBtn);

  const dateInput = screen.getByLabelText("Tanggal:");
  expect(dateInput).not.toHaveAttribute("readonly");
  fireEvent.change(dateInput, { target: { value: "2022-01-02" } });

  const nominalInput = screen.getByLabelText("Jumlah:");
  expect(nominalInput).not.toHaveAttribute("readonly");
  await user.type(nominalInput, "123");

  const createBtn = screen.getByTestId("edit-dues-btn");
  await user.click(createBtn);

  expect(screen.queryByText("Tidak boleh kosong")).not.toBeInTheDocument();
});

test("Admin successfully remove dues", async () => {
  render(<Dues />);

  const selectDues = await screen.findByTestId("select-comp");
  expect(selectDues).toBeInTheDocument();

  const duesBtn = await screen.findByTestId("option-dues-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const removeBtn = await screen.findByTestId("remove-dues-btn");
  await user.click(removeBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});

test("Admin successfully edit dues", async () => {
  server.use(
    rest.get(
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/:id/check`,
      (_, res, ctx) => {
        return res.once(
          ctx.json({
            data: {
              is_paid: true,
            },
          })
        );
      }
    )
  );

  render(<Dues />);

  const selectDues = await screen.findByTestId("select-comp");
  expect(selectDues).toBeInTheDocument();

  const duesBtn = await screen.findByTestId("option-dues-btn");
  await user.click(duesBtn);

  const duesDrawer = screen.getByTestId("dues-drawer");
  expect(duesDrawer).toHaveClass("test__drawer__open");

  const paidMsg = await screen.findByTestId("paid-dues-msg");
  expect(paidMsg).toBeInTheDocument;
});
