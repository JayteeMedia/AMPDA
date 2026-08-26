import {
  Cpu,
  HardDrive,
  Layers3,
} from "lucide-react";

export default function Header() {

  return (

    <header
      style={{

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        height: "100%",

        padding: "0 32px",

        background: "#111827",

        color: "#E5E7EB",

      }}
    >

      <div>

        <h2
          style={{

            fontSize: "1.35rem",

            fontWeight: 700,

          }}
        >
          AMPDA Command Center
        </h2>

        <div
          style={{

            marginTop: 4,

            color: "#94A3B8",

            fontSize: 13,

          }}
        >
          Autonomous Music Production & Distribution Agent
        </div>

      </div>

      <div
        style={{

          display: "flex",

          alignItems: "center",

          gap: 24,

        }}
      >

        <div
          style={{

            display: "flex",

            alignItems: "center",

            gap: 8,

            color: "#22C55E",

          }}
        >

          <Layers3 size={18} />

          <span>Runtime Healthy</span>

        </div>

        <div
          style={{

            display: "flex",

            alignItems: "center",

            gap: 8,

            color: "#94A3B8",

          }}
        >

          <Cpu size={18} />

          <span>qwen3.5:4b</span>

        </div>

        <div
          style={{

            display: "flex",

            alignItems: "center",

            gap: 8,

            color: "#94A3B8",

          }}
        >

          <HardDrive size={18} />

          <span>Queue 0</span>

        </div>

      </div>

    </header>

  );

}
