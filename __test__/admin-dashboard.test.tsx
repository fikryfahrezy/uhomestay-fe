import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import Dashboard from "@/pages/dashboard";

jest.mock("@/services/member", () => {
  return {
    adminLogin: async () => {},
    useAdmin: () => ({
      refetch: () => {},
    }),
  };
});

test("Render welcome message", () => {
  render(<Dashboard />);

  const heading = screen.getByText("Periode Aktif Saat Ini");

  expect(heading).toBeInTheDocument();
});
