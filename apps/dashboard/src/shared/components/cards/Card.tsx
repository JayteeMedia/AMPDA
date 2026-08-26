import type { ReactNode } from "react";

interface CardProps {

  children: ReactNode;

}

export default function Card({

  children,

}: CardProps) {

  return (

    <div

      style={{

        background: "#111827",

        border: "1px solid #2D3748",

        borderRadius: 12,

        padding: 24,

      }}

    >

      {children}

    </div>

  );

}
