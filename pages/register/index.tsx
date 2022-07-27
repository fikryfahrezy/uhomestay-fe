import type { MapMouseEvent, EventData } from "mapbox-gl";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { registerMember } from "@/services/member";
import Button from "cmnjg-sb/dist/button";
import TextArea from "cmnjg-sb/dist/textarea";
import Input from "cmnjg-sb/dist/input";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import PageNav from "@/layouts/pagenav";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const Register = () => {
  const { toast, updateToast, props } = useToast();
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);

  const defaultValues = {
    name: "",
    homestay_name: "",
    username: "",
    wa_phone: "",
    other_phone: "",
    homestay_address: "",
    homestay_latitude: String(lat),
    homestay_longitude: String(lng),
    password: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const registerMemberMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof registerMember>[0]
  >((data) => {
    return registerMember(data);
  });

  const onSubmit = handleSubmit((data) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading register" />,
    });

    registerMemberMutation
      .mutateAsync(data)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        updateToast(lastId, {
          status: "success",
          render: () => (
            <>Registratsi berhasil, menunggu konfirmasi pengelola. </>
          ),
        });
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error register"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  });

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);

    setValue("homestay_latitude", String(lat));
    setValue("homestay_longitude", String(lng));
  };

  return (
    <>
      <main className={styles.pageContainer}>
        <PageNav className={styles.navContainer} />
        <div className={styles.container}>
          <Link href="/">
            <a className={`${styles.link} ${styles.leftLink}`}>Kembali</a>
          </Link>
          <h1>Daftar Menjadi Anggota</h1>
          <form onSubmit={onSubmit}>
            <div className={styles.verticalGroup}>
              <div className={styles.inputGroup}>
                <Input
                  {...register("username", {
                    required: true,
                  })}
                  autoComplete="off"
                  label="Username:"
                  id="username"
                  required={true}
                  className={styles.input}
                  isInvalid={errors.username !== undefined}
                  errMsg={errors.username ? "Tidak boleh kosong" : ""}
                />
              </div>
              <div className={styles.inputGroup}>
                <Input
                  {...register("password", {
                    required: true,
                  })}
                  autoComplete="off"
                  label="Password:"
                  type="password"
                  id="password"
                  required={true}
                  className={styles.input}
                  isInvalid={errors.password !== undefined}
                  errMsg={errors.password ? "Tidak boleh kosong" : ""}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <Input
                {...register("name", {
                  required: true,
                })}
                autoComplete="off"
                label="Nama:"
                id="name"
                required={true}
                className={styles.input}
                isInvalid={errors.name !== undefined}
                errMsg={errors.name ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.verticalGroup}>
              <div className={styles.inputGroup}>
                <Input
                  {...register("wa_phone", {
                    required: true,
                  })}
                  autoComplete="off"
                  label="Nomor WA:"
                  id="wa_phone"
                  required={true}
                  className={styles.input}
                  isInvalid={errors["wa_phone"] !== undefined}
                  errMsg={errors["wa_phone"] ? "Tidak boleh kosong" : ""}
                />
              </div>
              <div className={styles.inputGroup}>
                <Input
                  {...register("other_phone", {
                    required: true,
                  })}
                  autoComplete="off"
                  label="Nomor Lainnya:"
                  note="(samakan dengan WA bila tidak ada)"
                  id="other_phone"
                  required={true}
                  className={styles.input}
                  isInvalid={errors["other_phone"] !== undefined}
                  errMsg={errors["other_phone"] ? "Tidak boleh kosong" : ""}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <Input
                {...register("homestay_name", {
                  required: true,
                })}
                autoComplete="off"
                label="Nama Homestay:"
                id="homestay_name"
                required={true}
                className={styles.input}
                isInvalid={errors["homestay_name"] !== undefined}
                errMsg={errors["homestay_name"] ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <TextArea
                {...register("homestay_address", {
                  required: true,
                })}
                label="Alamat Homestay:"
                id="homestay_address"
                required={true}
                className={styles.input}
                isInvalid={errors["homestay_address"] !== undefined}
                errMsg={errors["homestay_address"] ? "Tidak boleh kosong" : ""}
              />
            </div>
            <Map lat={lat} lng={lng} onClick={onMapClick} />
            <div className={styles.inputGroup}>
              <Input
                {...register("homestay_latitude", {})}
                autoComplete="off"
                label="Homestay Latitude:"
                id="homestay_latitude"
                type="hidden"
                required={true}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLat(val ? val : -70.9);
                }}
                isInvalid={errors["homestay_latitude"] !== undefined}
                errMsg={errors["homestay_latitude"] ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                {...register("homestay_longitude", {})}
                autoComplete="off"
                label="Homestay Longitude:"
                id="homestay_longitude"
                type="hidden"
                required={true}
                className={styles.input}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLng(val ? val : -70.9);
                }}
                isInvalid={errors["homestay_longitude"] !== undefined}
                errMsg={
                  errors["homestay_longitude"] ? "Tidak boleh kosong" : ""
                }
              />
            </div>
            <div>
              <Button
                colorScheme="green"
                type="submit"
                className={styles.button}
              >
                Register
              </Button>
            </div>
          </form>
          <Link href="/login/member">
            <a className={styles.link}>Masuk</a>
          </Link>
        </div>
      </main>
      <Toast {...props} />
    </>
  );
};

export default Register;
