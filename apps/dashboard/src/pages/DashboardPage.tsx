const cards = [

  {
    title: "Songs",
    value: "0",
  },

  {
    title: "Albums",
    value: "0",
  },

  {
    title: "Agents",
    value: "6",
  },

  {
    title: "Queue",
    value: "0",
  },

];

export default function DashboardPage() {

  return (

    <div
      style={{

        display: "flex",

        flexDirection: "column",

        gap: 32,

      }}
    >

      <section>

        <h1
          style={{

            fontSize: "2rem",

            fontWeight: 700,

            marginBottom: 8,

          }}
        >
          Dashboard
        </h1>

        <p
          style={{

            color: "#94A3B8",

          }}
        >
          Welcome to the AMPDA Command Center.
        </p>

      </section>

      <section
        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: 20,

        }}
      >

        {

          cards.map(

            card => (

              <div
                key={card.title}
                style={{

                  background: "#111827",

                  border: "1px solid #2D3748",

                  borderRadius: 14,

                  padding: 24,

                }}
              >

                <div
                  style={{

                    color: "#94A3B8",

                    fontSize: 14,

                    marginBottom: 12,

                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{

                    fontSize: 36,

                    fontWeight: 700,

                  }}
                >
                  {card.value}
                </div>

              </div>

            ),

          )

        }

      </section>

      <section
        style={{

          display: "grid",

          gridTemplateColumns:
            "2fr 1fr",

          gap: 20,

        }}
      >

        <div
          style={{

            background: "#111827",

            border: "1px solid #2D3748",

            borderRadius: 14,

            padding: 24,

            minHeight: 320,

          }}
        >

          <h2
            style={{

              marginBottom: 20,

            }}
          >
            Workflow Queue
          </h2>

          <p
            style={{

              color: "#94A3B8",

            }}
          >
            No active jobs.
          </p>

        </div>

        <div
          style={{

            background: "#111827",

            border: "1px solid #2D3748",

            borderRadius: 14,

            padding: 24,

            minHeight: 320,

          }}
        >

          <h2
            style={{

              marginBottom: 20,

            }}
          >
            Runtime
          </h2>

          <div
            style={{

              display: "flex",

              flexDirection: "column",

              gap: 12,

            }}
          >

            <div>

              Status

              <strong
                style={{

                  float: "right",

                  color: "#22C55E",

                }}
              >
                Healthy
              </strong>

            </div>

            <div>

              Model

              <strong
                style={{

                  float: "right",

                }}
              >
                qwen3.5:4b
              </strong>

            </div>

            <div>

              Queue

              <strong
                style={{

                  float: "right",

                }}
              >
                0
              </strong>

            </div>

            <div>

              Active Agents

              <strong
                style={{

                  float: "right",

                }}
              >
                6
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}
