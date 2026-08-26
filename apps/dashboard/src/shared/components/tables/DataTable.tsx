import type { ReactNode } from "react";

interface DataTableProps {

  headers: string[];

  children: ReactNode;

}

export default function DataTable({

  headers,

  children,

}: DataTableProps) {

  return (

    <table
      style={{

        width: "100%",

        borderCollapse: "collapse",

      }}
    >

      <thead>

        <tr>

          {headers.map(

            header => (

              <th

                key={header}

                style={{

                  textAlign: "left",

                  padding: 12,

                  borderBottom:
                    "1px solid #2D3748",

                  color: "#94A3B8",

                }}

              >

                {header}

              </th>

            ),

          )}

        </tr>

      </thead>

      <tbody>

        {children}

      </tbody>

    </table>

  );

}
