import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import Article from "@/pages/dashboard/article";
import ArticleView from "@/pages/dashboard/article/view/[id]";
import ArticleEdit from "@/pages/dashboard/article/edit/[id]";
import ArticleCreate from "@/pages/dashboard/article/create";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render title", () => {
  render(<Article />);

  const heading = screen.getByText("Artikel");

  expect(heading).toBeInTheDocument();
});

test("Render article item", async () => {
  render(<Article />);

  const blogItem = await screen.findByTestId("blog-container");

  expect(blogItem).toBeInTheDocument();
});

test("Render show article edit popup", async () => {
  render(<Article />);

  const blogItem = await screen.findByTestId("blog-container");
  expect(blogItem).toBeInTheDocument();

  const popupBtn = screen.getByTestId("blog-popup-btn");
  await user.click(popupBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const detailBtn = screen.getByTestId("blog-detail-popup");
  expect(detailBtn).toBeVisible();
});

test("Render show article edit popup", async () => {
  render(<Article />);

  const blogItem = await screen.findByTestId("blog-container");
  expect(blogItem).toBeInTheDocument();

  const popupBtn = screen.getByTestId("blog-popup-btn");
  await user.click(popupBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const editBtn = screen.getByTestId("blog-edit-popup");
  expect(editBtn).toBeVisible();
});

test("Remove article", async () => {
  render(<Article />);

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

test("View article", async () => {
  render(<ArticleView />);

  const leditorRead = await screen.findByTestId("lexical-editor-blog-read");
  expect(leditorRead).toBeInTheDocument();
});

test("Remove article from detail", async () => {
  render(<ArticleView />);

  const leditorRead = await screen.findByTestId("lexical-editor-blog-read");
  expect(leditorRead).toBeInTheDocument();

  const removeBtn = screen.getByTestId("remove-blog-btn");
  expect(removeBtn).toBeInTheDocument();
  await user.click(removeBtn);

  const popModlConf = await screen.findByTestId("popup-modal-conf-btn");
  expect(removeBtn).toBeInTheDocument();
  await user.click(popModlConf);
});

test("Edit article", async () => {
  render(<ArticleEdit />);

  const leditorWrite = await screen.findByTestId("lexical-editor-blog-write");
  expect(leditorWrite).toBeInTheDocument();
  await user.type(leditorWrite, "test");

  const editBtn = screen.getByTestId("blog-edit-btn");
  await user.click(editBtn);
});

test("Create article", async () => {
  render(<ArticleCreate />);

  const leditorWrite = await screen.findByTestId("lexical-editor-blog-write");
  expect(leditorWrite).toBeInTheDocument();
  await user.type(leditorWrite, "test");

  const editBtn = screen.getByTestId("create-blog-btn");
  await user.click(editBtn);
});
