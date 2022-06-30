import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import OrgGoal from "@/pages/dashboard/organization/mission";
import OrgGoalView from "@/pages/dashboard/organization/mission/view/[id]";
import OrgGoalCreate from "@/pages/dashboard/organization/mission/create/[id]";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render period goal title", () => {
  render(<OrgGoal />);

  const heading = screen.getByText("Visi & Misi Periode");

  expect(heading).toBeInTheDocument();
});

test("Render organization period list", async () => {
  render(<OrgGoal />);

  const periodChip = await screen.findByTestId("period-chip");
  expect(periodChip).toBeInTheDocument();
});

test("Render organization period list", async () => {
  render(<OrgGoal />);

  const periodChip = await screen.findByTestId("period-chip");
  expect(periodChip).toBeInTheDocument();
});

test("View period goal", async () => {
  render(<OrgGoalView />);

  await waitFor(() => {
    expect(screen.getByTestId("mission-edit-btn")).toBeInTheDocument();
  });

  const leditorReads = await screen.findAllByTestId("lexical-editor-rich-read");
  leditorReads.forEach((leditorRead) => {
    expect(leditorRead).toBeInTheDocument();
  });
});

test("Update period goal", async () => {
  render(<OrgGoalCreate />);

  const leditorWrites = await screen.findAllByTestId(
    "lexical-editor-rich-write"
  );
  leditorWrites.forEach((leditorWrite) => {
    expect(leditorWrite).toBeInTheDocument();
  });
  await Promise.all(
    leditorWrites.map((leditorWrite) => user.type(leditorWrite, "test"))
  );

  const updateBtn = screen.getByTestId("mission-update-btn");
  await user.click(updateBtn);
});
