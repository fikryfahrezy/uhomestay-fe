import { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
      cacheTime: 0,
    },
  },
});

const RQWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RQWrapper>
      {children}
      <div id="modal" />
      <div id="lexical-portal" />
    </RQWrapper>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
