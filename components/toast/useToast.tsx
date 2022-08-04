import type { AlertProps } from "../alert";
import { useState, useRef } from "react";

type ToastFnParam = Partial<{
  duration: number;
  status: AlertProps["status"];
  render?: () => JSX.Element | null;
}>;

type ToastState = ToastFnParam & {
  id: number;
  timeoutId: number;
  onCloseToast: () => void;
};

type ToastProps = {
  isOpen: boolean;
  toasts: ToastState[];
};

export type UseToastReturn = {
  toast: (param: ToastFnParam) => number;
  updateToast: (toastId: number, options: ToastFnParam) => number;
  props: ToastProps;
};

export const useToast: () => UseToastReturn = () => {
  const id = useRef(0);
  const tempToasts = useRef<ToastState[]>([]);
  const [state, setState] = useState<ToastProps>({
    isOpen: false,
    toasts: [],
  });

  const toast: (options: ToastFnParam) => number = (options) => {
    if (typeof options !== "object" || Array.isArray(options)) {
      options = {};
    }

    const toastId = ++id.current;
    const timeoutId = window.setTimeout(() => {
      setState((prevState) => {
        const newToast = prevState.toasts.slice(0, prevState.toasts.length - 1);

        tempToasts.current = newToast;

        return {
          ...prevState,
          toasts: newToast,
        };
      });
    }, options.duration || 5000);

    setState((prevState) => {
      const newToast = [
        ...prevState.toasts,
        {
          ...options,
          id: toastId,
          timeoutId: timeoutId,
          onCloseToast: onCloseToast(toastId, timeoutId),
        },
      ];

      tempToasts.current = newToast;

      return {
        ...prevState,
        isOpen: true,
        toasts: newToast,
      };
    });

    return toastId;
  };

  const onCloseToast = (toastId: number, timeoutId: number) => {
    return () => {
      window.clearTimeout(timeoutId);

      setState((prevState) => {
        const idx = prevState.toasts.findIndex(({ id }) => id === toastId);
        if (idx === -1) {
          return prevState;
        }

        const newToast = [
          ...prevState.toasts.slice(0, idx),
          ...prevState.toasts.slice(idx + 1),
        ];

        tempToasts.current = newToast;

        return {
          ...prevState,
          toasts: newToast,
        };
      });
    };
  };

  const updateToast = (toastId: number, options: ToastFnParam) => {
    const idx = tempToasts.current.findIndex(({ id }) => id === toastId);
    if (idx === -1) {
      return toast(options);
    }

    if (typeof options !== "object" || Array.isArray(options)) {
      options = {};
    }

    const prevToast = tempToasts.current[idx];
    window.clearTimeout(prevToast.timeoutId);

    const timeoutId = window.setTimeout(() => {
      setState((prevState) => {
        const idx = prevState.toasts.findIndex(({ id }) => id === toastId);
        if (idx === -1) {
          return prevState;
        }

        const newToast = [
          ...prevState.toasts.slice(0, idx),
          ...prevState.toasts.slice(idx + 1),
        ];

        tempToasts.current = newToast;

        return {
          ...prevState,
          toasts: newToast,
        };
      });
    }, options.duration || 5000);

    setState((prevState) => {
      const newToast = [
        ...prevState.toasts.slice(0, idx),
        {
          ...options,
          id: toastId,
          timeoutId: timeoutId,
          onCloseToast: onCloseToast(toastId, timeoutId),
        },
        ...prevState.toasts.slice(idx + 1),
      ];

      tempToasts.current = newToast;

      return {
        ...prevState,
        isOpen: true,
        toasts: newToast,
      };
    });

    return toastId;
  };

  return { toast, updateToast, props: { ...state } };
};

export default useToast;
