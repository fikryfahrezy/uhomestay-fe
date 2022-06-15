import type { AlertProps } from "@/components/alert";
import { useState, useEffect } from "react";

export type ToastProps = {
  isOpen: boolean;
  duration: number;
  status: AlertProps["status"];
  onCloseToast: () => void;
  render?: () => JSX.Element | null;
};

type ToastFnParam = Partial<Omit<ToastProps, "isOpen" | "onCloseToast">>;

type UseToastReturn = {
  toast: (param: ToastFnParam) => void;
  props: ToastProps;
};

export const useToast: () => UseToastReturn = () => {
  const [state, setState] = useState<Omit<ToastProps, "onCloseToast">>({
    status: "info",
    isOpen: false,
    duration: 5000,
    render: undefined,
  });

  useEffect(() => {
    let timeoutId: number | null = null;
    if (state.isOpen === true) {
      timeoutId = window.setTimeout(() => {
        setState((prevState) => {
          return {
            ...prevState,
            isOpen: false,
          };
        });
      }, state.duration);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.duration, state.isOpen]);

  const toast = (options: ToastFnParam) => {
    if (typeof options !== "object" || Array.isArray(options)) {
      options = {};
    }
    setState((prevState) => {
      return {
        ...prevState,
        ...options,
        isOpen: true,
      };
    });
  };

  const onCloseToast = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isOpen: false,
      };
    });
  };

  return { toast, props: { ...state, onCloseToast } };
};

export default useToast;
