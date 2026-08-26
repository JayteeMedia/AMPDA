import type {
  ReactNode,
} from "react";

interface ToolbarProps {

  children: ReactNode;

}

export default function Toolbar({

  children,

}: ToolbarProps) {

  return (

    <div

      style={{

        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        marginBottom: 24,

      }}

    >

      {children}

    </div>

  );

}
