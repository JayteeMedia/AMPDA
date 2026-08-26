interface PageShellProps {

  title: string;

  description?: string;

  children?: React.ReactNode;

}

export default function PageShell({

  title,

  description,

  children,

}: PageShellProps) {

  return (

    <div
      style={{

        display: "flex",

        flexDirection: "column",

        gap: 24,

      }}
    >

      <div>

        <h1
          style={{

            fontSize: "2rem",

            fontWeight: 700,

            color: "#E5E7EB",

          }}
        >
          {title}
        </h1>

        {

          description && (

            <p
              style={{

                marginTop: 8,

                color: "#94A3B8",

                fontSize: 15,

              }}
            >
              {description}
            </p>

          )

        }

      </div>

      <div>

        {children}

      </div>

    </div>

  );

}
