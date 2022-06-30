import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "./test-utils";
import HistoryView from "@/pages/dashboard/organization/history";
import HistoryWrite from "@/pages/dashboard/organization/history/write";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render history title", () => {
  render(<HistoryView />);

  const heading = screen.getByText("Sejarah");

  expect(heading).toBeInTheDocument();
});

test("Render history text", async () => {
  render(<HistoryView />);

  const leditorRead = await screen.findByTestId("lexical-editor-rich-read");
  expect(leditorRead).toBeInTheDocument();
});

test("Update history", async () => {
  render(<HistoryWrite />);

  const leditorWrite = await screen.findByTestId("lexical-editor-rich-write");
  expect(leditorWrite).toBeInTheDocument();
  await user.type(leditorWrite, "test");

  const updateBtn = screen.getByTestId("edit-history-btn");
  await user.click(updateBtn);
});
