import { render, screen } from "./test-utils";
import MemberLogin from "@/pages/login/member";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a heading", () => {
    render(<MemberLogin />);

    const heading = screen.getByRole("heading", {
      name: /Selamat Datang/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
