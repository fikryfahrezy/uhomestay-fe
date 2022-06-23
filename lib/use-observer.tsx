import { useRef, useCallback } from "react";

type ObserveProps = {
  callback: () => void;
};

const Observe = ({ callback }: ObserveProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const obs = useCallback(
    (e: HTMLElement | null) => {
      if (!e) {
        return;
      }
      if (observer.current !== null) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback();
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      observer.current.observe(e);
    },
    [callback]
  );

  return <p ref={obs} />;
};

export default Observe;
