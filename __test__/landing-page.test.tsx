import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import LandingPage from "@/pages/index";

test("Render welcome message", () => {
  render(<LandingPage />);

  const heading = screen.getByText("Paguyuban Homestay Desa Laksana");

  expect(heading).toBeInTheDocument();
});
