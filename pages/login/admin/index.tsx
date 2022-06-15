import { useForm } from "react-hook-form";
import Image from "next/image";
import { adminLogin, useAdmin } from "@/services/member";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import PageNav from "@/layout/pagenav";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import styles from "./Styles.module.css";

const Login = () => {
  const { toast, props } = useToast();
  const defaultValues = {
    identifier: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const adminQuery = useAdmin({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  const onSubmit = handleSubmit((data) => {
    adminLogin(data)
      .then((res) => {
        adminQuery.refetch();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  });

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
          <div>
            <h1>Selamat Datang</h1>
            <form onSubmit={onSubmit}>
              <div className={styles.inputGroup}>
                <Input
                  {...register("identifier", {
                    minLength: 6,
                    maxLength: 20,
                    required: true,
                  })}
                  autoComplete="off"
                  type="text"
                  name="identifier"
                  placeholder="username"
                  aria-label="username"
                  className={styles.input}
                  isInvalid={errors.identifier !== undefined}
                />
                {errors.identifier ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.inputGroup}>
                <Input
                  {...register("password", {
                    required: true,
                    pattern: /[a-z]{0,9}/i,
                  })}
                  autoComplete="off"
                  type="password"
                  placeholder="*****"
                  aria-label="password"
                  className={styles.input}
                  isInvalid={errors.password !== undefined}
                />
                {errors.password ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </div>
              <Button
                colorScheme="green"
                type="submit"
                className={styles.button}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Toast {...props} />
    </>
  );
};

export default Login;