import { NavLink } from "react-router-dom";

import {
  navigation,
} from "../../navigation/navigation.js";

export default function Sidebar() {

  return (

    <aside
      style={{

        display: "flex",

        flexDirection: "column",

        height: "100%",

        background: "#111827",

        color: "#E5E7EB",

      }}
    >

      <div
        style={{

          padding: "24px",

          borderBottom:
            "1px solid #2D3748",

        }}
      >

        <h1
          style={{

            fontSize: "1.5rem",

            fontWeight: 700,

          }}
        >
          AMPDA
        </h1>

        <p
          style={{

            marginTop: 6,

            color: "#94A3B8",

            fontSize: 13,

          }}
        >
          Command Center
        </p>

      </div>

      <nav
        style={{

          display: "flex",

          flexDirection: "column",

          gap: 6,

          padding: 16,

        }}
      >

        {

          navigation.map(

            item => {

              const Icon =
                item.icon;

              return (

                <NavLink

                  key={item.path}

                  to={item.path}

                  end={
                    item.path === "/"
                  }

                  style={

                    ({ isActive }) => ({

                      display: "flex",

                      alignItems: "center",

                      gap: 12,

                      padding: "12px 14px",

                      borderRadius: 10,

                      textDecoration: "none",

                      color: isActive
                        ? "#FFFFFF"
                        : "#E5E7EB",

                      background: isActive
                        ? "#2563EB"
                        : "transparent",

                      transition:
                        "all .2s ease",

                      fontWeight:
                        isActive
                          ? 600
                          : 500,

                    })

                  }

                >

                  <Icon size={18} />

                  <span>

                    {item.label}

                  </span>

                </NavLink>

              );

            },

          )

        }

      </nav>

      <div
        style={{

          marginTop: "auto",

          padding: 20,

          borderTop:
            "1px solid #2D3748",

        }}
      >

        <div
          style={{

            fontSize: 12,

            color: "#94A3B8",

          }}
        >
          AMPDA v0.1.0
        </div>

      </div>

    </aside>

  );

}
