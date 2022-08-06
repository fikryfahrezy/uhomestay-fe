import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "react-query";
import { memberLogin, useMember } from "@/services/member";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import PageNav from "@/layouts/pagenav";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

const Login = () => {
  const { toast, updateToast, props } = useToast();

  const defaultValues = {
    identifier: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const loginQuery = useMember({
    redirectTo: "/member",
    redirectIfFound: true,
  });

  const memberLoginMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof memberLogin>[0]
  >((data) => {
    return memberLogin(data);
  });

  const onSubmit = handleSubmit((data) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading login" />,
    });

    memberLoginMutation
      .mutateAsync(data)
      .then(() => {
        loginQuery.refetch();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error login"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
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
              alt="Website Logo"
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
                    required: true,
                  })}
                  autoComplete="off"
                  type="text"
                  name="identifier"
                  placeholder="username"
                  aria-label="username"
                  className={styles.input}
                  isInvalid={errors.identifier !== undefined}
                  errMsg={errors.identifier ? "Tidak boleh kosong" : ""}
                />
              </div>
              <div className={styles.inputGroup}>
                <Input
                  {...register("password", {
                    required: true,
                  })}
                  autoComplete="off"
                  type="password"
                  placeholder="*****"
                  aria-label="password"
                  className={styles.input}
                  isInvalid={errors.password !== undefined}
                  errMsg={errors.password ? "Tidak boleh kosong" : ""}
                />
              </div>
              <Button
                colorScheme="green"
                type="submit"
                className={styles.button}
              >
                Login
              </Button>
            </form>
            <Link href="/register">
              <a className={styles.link}>Daftar</a>
            </Link>
          </div>
        </div>
      </main>
      <Toast {...props} />
    </>
  );
};

export default Login;
