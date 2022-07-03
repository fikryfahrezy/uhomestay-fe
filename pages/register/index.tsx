import type { MapMouseEvent, EventData } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { registerMember } from "@/services/member";
import { Input, Textarea, Button, Toast } from "cmnjg-sb";
import { useToast } from "@/components/toast";
import PageNav from "@/layouts/pagenav";
import InputErrMsg from "@/layouts/inputerrmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const Register = () => {
  const { toast, props } = useToast();
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

  const onSubmit = handleSubmit((data) => {
    registerMember(data)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        toast({
          status: "success",
          render: () => (
            <>Registrasi berhasil, menunggu konfirmasi pengelola.</>
          ),
        });
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
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
      <main className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.logoContainer}>
            <PageNav />
          </div>
          <div className={styles.sideImgContainer}>
            <Image
              src="/images/image/login-bg.png"
              layout="fill"
              objectFit="cover"
              alt="blsa"
              priority={true}
            />
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.formContainer}>
            <h1>Selamat Datang</h1>
            <form onSubmit={onSubmit}>
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
                />
                {errors.username ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors.password ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors.name ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </div>
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
                />
                {errors["wa_phone"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors["other_phone"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors["homestay_name"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.inputGroup}>
                <Textarea
                  {...register("homestay_address", {
                    required: true,
                  })}
                  label="Alamat Homestay:"
                  id="homestay_address"
                  required={true}
                  className={styles.input}
                  isInvalid={errors["homestay_address"] !== undefined}
                />
                {errors["homestay_address"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors["homestay_latitude"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
                />
                {errors["homestay_longitude"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
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
          </div>
        </div>
      </main>
      <Toast {...props} />
    </>
  );
};

export default Register;
