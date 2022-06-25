import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import OrgPeriod from "@/pages/dashboard/membership/org";

test("Render periode organisasi title", () => {
  render(<OrgPeriod />);

  const heading = screen.getByText("Periode Organisasi");

  expect(heading).toBeInTheDocument();
});
