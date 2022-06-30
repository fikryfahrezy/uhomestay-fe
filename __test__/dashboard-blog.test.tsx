import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import Blog from "@/pages/dashboard/blog";
import BlogView from "@/pages/dashboard/blog/view/[id]";
import BlogEdit from "@/pages/dashboard/blog/edit/[id]";
import BlogCreate from "@/pages/dashboard/blog/create";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render history title", () => {
  render(<Blog />);

  const heading = screen.getByText("Blog");

  expect(heading).toBeInTheDocument();
});

test("Render blog item", async () => {
  render(<Blog />);

  const blogItem = await screen.findByTestId("blog-container");

  expect(blogItem).toBeInTheDocument();
});

test("Render show blog edit popup", async () => {
  render(<Blog />);

  const blogItem = await screen.findByTestId("blog-container");
  expect(blogItem).toBeInTheDocument();

  const popupBtn = screen.getByTestId("blog-popup-btn");
  await user.click(popupBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const detailBtn = screen.getByTestId("blog-detail-popup");
  expect(detailBtn).toBeVisible();
});

test("Render show blog edit popup", async () => {
  render(<Blog />);

  const blogItem = await screen.findByTestId("blog-container");
  expect(blogItem).toBeInTheDocument();

  const popupBtn = screen.getByTestId("blog-popup-btn");
  await user.click(popupBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const editBtn = screen.getByTestId("blog-edit-popup");
  expect(editBtn).toBeVisible();
});

test("Remove blog", async () => {
  render(<Blog />);

  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "modal");
  document.body.appendChild(portalRoot);

  const blogItem = await screen.findByTestId("blog-container");
  expect(blogItem).toBeInTheDocument();

  const popupBtn = screen.getByTestId("blog-popup-btn");
  await user.click(popupBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const removeBtn = screen.getByTestId("blog-remove-popup");
  expect(removeBtn).toBeVisible();
  await user.click(removeBtn);

  const popModlConf = await screen.findByTestId("popup-modal-conf-btn");
  expect(removeBtn).toBeInTheDocument();
  await user.click(popModlConf);

  await waitFor(() => {
    expect(popModlConf).not.toBeInTheDocument();
  });
});

test("View blog", async () => {
  render(<BlogView />);

  const leditorRead = await screen.findByTestId("lexical-editor-blog-read");
  expect(leditorRead).toBeInTheDocument();
});

test("Remove blog from detail", async () => {
  render(<BlogView />);

  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "modal");
  document.body.appendChild(portalRoot);

  const leditorRead = await screen.findByTestId("lexical-editor-blog-read");
  expect(leditorRead).toBeInTheDocument();

  const removeBtn = screen.getByTestId("remove-blog-btn");
  expect(removeBtn).toBeInTheDocument();
  await user.click(removeBtn);

  const popModlConf = await screen.findByTestId("popup-modal-conf-btn");
  expect(removeBtn).toBeInTheDocument();
  await user.click(popModlConf);
});

test("Edit blog", async () => {
  render(<BlogEdit />);

  const leditorWrite = await screen.findByTestId("lexical-editor-blog-write");
  expect(leditorWrite).toBeInTheDocument();
  await user.type(leditorWrite, "test");

  const editBtn = screen.getByTestId("blog-edit-btn");
  await user.click(editBtn);
});

test("Create blog", async () => {
  render(<BlogCreate />);

  const leditorWrite = await screen.findByTestId("lexical-editor-blog-write");
  expect(leditorWrite).toBeInTheDocument();
  await user.type(leditorWrite, "test");

  const editBtn = screen.getByTestId("create-blog-btn");
  await user.click(editBtn);
});
