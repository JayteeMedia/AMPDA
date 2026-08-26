import type {
  ReactNode,
} from "react";

interface ModalProps {

  open: boolean;

  children: ReactNode;

}

export default function Modal({

  open,

  children,

}: ModalProps) {

  if (!open) {

    return null;

  }

  return (

    <div

      style={{

        position: "fixed",

        inset: 0,

        display: "flex",

        alignItems: "center",

        justifyContent:
          "center",

        background:
          "rgba(0,0,0,.5)",

      }}

    >

      <div

        style={{

          background: "#111827",

          padding: 24,

          borderRadius: 12,

          minWidth: 420,

        }}

      >

        {children}

      </div>

    </div>

  );

}
