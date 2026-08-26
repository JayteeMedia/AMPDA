import type { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?:
    | "primary"
    | "secondary"
    | "danger";

}

export default function Button({

  variant = "primary",

  children,

  style,

  ...props

}: ButtonProps) {

  const background =

    variant === "primary"
      ? "#2563EB"
      : variant === "danger"
      ? "#DC2626"
      : "#374151";

  return (

    <button

      {...props}

      style={{

        padding: "10px 16px",

        border: "none",

        borderRadius: 8,

        cursor: "pointer",

        color: "#FFFFFF",

        background,

        fontWeight: 600,

        ...style,

      }}

    >

      {children}

    </button>

  );

}
