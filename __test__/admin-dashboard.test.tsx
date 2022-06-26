import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import Dashboard from "@/pages/dashboard";

test("Render welcome message", () => {
  render(<Dashboard />);

  const heading = screen.getByText("Periode Aktif Saat Ini");

  expect(heading).toBeInTheDocument();
});
