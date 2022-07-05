import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { render, screen, waitFor } from "./test-utils";
import Member from "@/pages/member/index";
import { server } from "../__mocks__/server";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render text in page", async () => {
  window.localStorage.setItem("muid", "f79e82e8-c34a-4dc7-a49e-9fadc0979fda");

  render(<Member />);

  const text = await screen.findByText("Nomor WA");

  expect(text).toBeInTheDocument();
});

test("Member successfully paydues", async () => {
  window.localStorage.setItem("muid", "f79e82e8-c34a-4dc7-a49e-9fadc0979fda");

  render(<Member />);

  const duesBtn = await screen.findByTestId("dues-detail-btn");
  await user.click(duesBtn);

  const formTitle = screen.getByTestId("pay-dues-title");
  expect(formTitle).toBeInTheDocument();

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const proveInput = await screen.findByTestId("input-file-field-comp");
  expect(proveInput).toBeInTheDocument();
  await user.upload(proveInput, file);

  const payBtn = screen.getByTestId("pay-dues-btn");
  await user.click(payBtn);

  await waitFor(() => {
    expect(
      screen.queryByText("Tidak boleh kosong")
    ).not.toBeInTheDocument();
  });
});

test("View paid dues", async () => {
  server.use(
    rest.get(
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/:id`,
      (_, res, ctx) => {
        return res.once(
          ctx.json({
            data: {
              cursor: 0,
              total_dues: "",
              paid_dues: "",
              unpaid_dues: "",
              dues: [
                {
                  id: 1,
                  dues_id: 1,
                  idr_amount: "0",
                  date: "",
                  member_id: "f79e82e8-c34a-4dc7-a49e-9fadc0979fda",
                  status: "paid",
                  name: "",
                  profile_pic_url: "http://localhost",
                },
              ],
            },
          })
        );
      }
    )
  );

  window.localStorage.setItem("muid", "f79e82e8-c34a-4dc7-a49e-9fadc0979fda");

  render(<Member />);

  const duesBtn = await screen.findByTestId("dues-detail-btn");
  await user.click(duesBtn);

  const formTitle = screen.getByTestId("detail-dues-title");
  expect(formTitle).toBeInTheDocument();
});
