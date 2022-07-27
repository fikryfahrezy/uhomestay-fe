import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./test-utils";
import Gallery from "@/pages/dashboard/gallery";

let user: ReturnType<typeof userEvent.setup>;

beforeAll(() => {
  user = userEvent.setup();
});

test("Render welcome message", () => {
  render(<Gallery />);

  const heading = screen.getByText("Galeri");

  expect(heading).toBeInTheDocument();
});

test("Admin successfully upload photo", async () => {
  render(<Gallery />);

  const addBtn = await screen.findByTestId("add-gallery-btn");
  await user.click(addBtn);

  const modalForm = await screen.findByTestId("gallery-add-modal-form");
  expect(modalForm).toBeInTheDocument();

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const fileInput = await screen.findByTestId("image-picker-input");
  expect(fileInput).toBeInTheDocument();
  await user.upload(fileInput, file);

  const addGalleryBtn = screen.getByTestId("gallery-add-btn");
  await user.click(addGalleryBtn);

  const errMsg = screen.queryByText("Tidak boleh kosong");
  expect(errMsg).not.toBeInTheDocument();

  const toastModal = screen.queryByTestId("toast-modal");
  expect(toastModal).not.toBeInTheDocument();

  await waitFor(() => {
    expect(modalForm).not.toBeInTheDocument();
  });
});

test("Admin successfully remove photo", async () => {
  render(<Gallery />);

  const galleryImgContainer = await screen.findByTestId(
    "gallery-img-container"
  );
  expect(galleryImgContainer).toBeInTheDocument();
  await user.click(galleryImgContainer);

  const removeGalleryBtn = await screen.findByTestId("gallery-remove-btn");
  expect(removeGalleryBtn).toBeInTheDocument();
  await user.click(removeGalleryBtn);

  const popupModalConfBtn = screen.getByTestId("popup-modal-conf-btn");
  expect(popupModalConfBtn).toBeInTheDocument();
  await user.click(popupModalConfBtn);

  await waitFor(() => {
    expect(popupModalConfBtn).not.toBeInTheDocument();
  });
});
