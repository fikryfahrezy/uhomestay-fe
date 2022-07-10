import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { render, screen, waitFor } from "./test-utils";
import Organization from "@/pages/dashboard/organization";
import { server } from "../__mocks__/server";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render welcome message", () => {
  render(<Organization />);

  const heading = screen.getByText("Dokumen");

  expect(heading).toBeInTheDocument();
});

// Add Folder

test("Admin successfully add folder", async () => {
  render(<Organization />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const folderBtn = screen.getByTestId("popup-dir-btn");
  expect(folderBtn).toBeVisible();
  await user.click(folderBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const folderInput = screen.getByLabelText("Nama Folder:");
  await user.type(folderInput, "test");

  const addDirBtn = screen.getByTestId("add-dir-btn");
  await user.click(addDirBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

test("Admin successfully add file", async () => {
  render(<Organization />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const folderBtn = screen.getByTestId("popup-file-btn");
  expect(folderBtn).toBeVisible();
  await user.click(folderBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const fileInput = await screen.findByTestId("input-file-field-comp");
  expect(fileInput).toBeInTheDocument();
  await user.upload(fileInput, file);

  const addDirBtn = screen.getByTestId("add-file-btn");
  await user.click(addDirBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

test("Admin cancel add folder", async () => {
  render(<Organization />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const folderBtn = screen.getByTestId("popup-dir-btn");
  expect(folderBtn).toBeVisible();
  await user.click(folderBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const cnclBtn = screen.getByTestId("cancel-add-dir-btn");
  await user.click(cnclBtn);

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

test("Admin cancel add file", async () => {
  render(<Organization />);

  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const popupCont = screen.getByTestId("popup-container");
  expect(popupCont).not.toHaveClass("test__popup__hidden");

  const folderBtn = screen.getByTestId("popup-file-btn");
  expect(folderBtn).toBeVisible();
  await user.click(folderBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const cnclBtn = screen.getByTestId("cancel-add-file-btn");
  await user.click(cnclBtn);

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

// Update File
test("Admin successfully edit file", async () => {
  render(<Organization />);

  const addBtn = await screen.findByTestId("docs-detail-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const folderBtn = screen.getByTestId("editable-file-btn");
  expect(folderBtn).toBeInTheDocument();
  await user.click(folderBtn);

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const fileInput = await screen.findByTestId("input-file-field-comp");
  expect(fileInput).toBeInTheDocument();
  expect(fileInput).toBeEnabled();
  await userEvent.upload(fileInput, file);

  const editBtn = screen.getByTestId("edit-file-btn");
  expect(editBtn).toBeInTheDocument();
  await user.click(editBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

test("Admin successfully edit folder", async () => {
  server.use(
    rest.get(
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/:id`,
      (_, res, ctx) => {
        return res.once(
          ctx.json({
            data: {
              cursor: 0,
              documents: [
                {
                  id: 1,
                  name: "Dir",
                  type: "dir",
                  url: "",
                  dir_id: 0,
                  is_private: false,
                },
              ],
            },
          })
        );
      }
    )
  );

  render(<Organization />);

  const addBtn = await screen.findByTestId("docs-detail-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const folderBtn = screen.getByTestId("editable-dir-btn");
  expect(folderBtn).toBeInTheDocument();
  await user.click(folderBtn);

  const folderInput = screen.getByLabelText("Nama Folder:");
  expect(folderInput).not.toHaveAttribute("readonly");
  await user.type(folderInput, "test");

  const editBtn = screen.getByTestId("edit-dir-btn");
  expect(editBtn).toBeInTheDocument();
  await user.click(editBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();

  await waitFor(() => {
    expect(docDrawer).not.toHaveClass("test__drawer__open");
  });
});

test("Admin successfully remove file", async () => {
  render(<Organization />);

  const addBtn = await screen.findByTestId("docs-detail-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editBtn = screen.getByTestId("remove-file-btn");
  expect(editBtn).toBeInTheDocument();
  await user.click(editBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});

test("Admin successfully remove folder", async () => {
  server.use(
    rest.get(
      `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/:id`,
      (_, res, ctx) => {
        return res.once(
          ctx.json({
            data: {
              cursor: 0,
              documents: [
                {
                  id: 1,
                  name: "Dir",
                  type: "dir",
                  url: "",
                  dir_id: 0,
                  is_private: false,
                },
              ],
            },
          })
        );
      }
    )
  );

  render(<Organization />);

  const addBtn = await screen.findByTestId("docs-detail-btn");
  await user.click(addBtn);

  const docDrawer = screen.getByTestId("doc-drawer");
  expect(docDrawer).toHaveClass("test__drawer__open");

  const editBtn = screen.getByTestId("remove-dir-btn");
  expect(editBtn).toBeInTheDocument();
  await user.click(editBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});
