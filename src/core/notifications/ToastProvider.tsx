import { memo, PropsWithChildren } from "react";
import * as React from "react";
import { DefaultToastOptions, Toaster } from "react-hot-toast";

const TOAST_OPTIONS: DefaultToastOptions = {
  style: {
    padding: 0,
    background: "transparent",
    boxShadow: "none",
    maxWidth: "400px",
  },
};

export const ToastProvider: React.FC<PropsWithChildren> = memo(
  ({ children }) => (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ zIndex: 9999 }}
        toastOptions={TOAST_OPTIONS}
      />
    </>
  ),
);
