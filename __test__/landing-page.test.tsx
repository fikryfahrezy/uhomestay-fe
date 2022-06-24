import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import LandingPage from "@/pages/index";

jest.mock("@/services/member", () => {
  return {
    adminLogin: async () => {},
    useAdmin: () => ({
      refetch: () => {},
    }),
  };
});

test("Render welcome message", () => {
  render(<LandingPage />);

  const heading = screen.getByText("Paguyuban Homestay Desa Laksana");

  expect(heading).toBeInTheDocument();
});
