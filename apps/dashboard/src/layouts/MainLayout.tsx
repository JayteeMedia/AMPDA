import {
  Outlet,
} from "react-router-dom";

import Header from "../components/layout/Header.js";
import Sidebar from "../components/layout/Sidebar.js";

export default function MainLayout() {

  return (

    <div
      style={{

        display: "grid",

        gridTemplateColumns: "260px 1fr",

        gridTemplateRows: "72px 1fr",

        minHeight: "100vh",

        background: "#0B0F14",

      }}
    >

      <aside
        style={{

          gridRow: "1 / span 2",

          borderRight: "1px solid #2D3748",

          overflowY: "auto",

        }}
      >

        <Sidebar />

      </aside>

      <header
        style={{

          borderBottom: "1px solid #2D3748",

          background: "#111827",

          position: "sticky",

          top: 0,

          zIndex: 10,

        }}
      >

        <Header />

      </header>

      <main
        style={{

          overflow: "auto",

          padding: "32px",

          background: "#0B0F14",

        }}
      >

        <Outlet />

      </main>

    </div>

  );

}
