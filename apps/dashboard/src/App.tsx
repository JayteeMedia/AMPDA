import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout.js";

import DashboardPage from "./pages/Dashboard/DashboardPage.js";
import SongsPage from "./pages/Songs/SongsPage.js";
import AlbumsPage from "./pages/Albums/AlbumsPage.js";
import AgentsPage from "./pages/Agents/AgentsPage.js";
import WorkflowsPage from "./pages/Workflows/WorkflowsPage.js";
import PromptsPage from "./pages/Prompts/PromptsPage.js";
import MemoryPage from "./pages/Memory/MemoryPage.js";
import ArtworkPage from "./pages/Artwork/ArtworkPage.js";
import DistributionPage from "./pages/Distribution/DistributionPage.js";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage.js";
import AssetsPage from "./pages/Assets/AssetsPage.js";
import LogsPage from "./pages/Logs/LogsPage.js";
import SettingsPage from "./pages/Settings/SettingsPage.js";

export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<MainLayout />}
      >

        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="songs"
          element={<SongsPage />}
        />

        <Route
          path="albums"
          element={<AlbumsPage />}
        />

        <Route
          path="agents"
          element={<AgentsPage />}
        />

        <Route
          path="workflows"
          element={<WorkflowsPage />}
        />

        <Route
          path="prompts"
          element={<PromptsPage />}
        />

        <Route
          path="memory"
          element={<MemoryPage />}
        />

        <Route
          path="artwork"
          element={<ArtworkPage />}
        />

        <Route
          path="distribution"
          element={<DistributionPage />}
        />

        <Route
          path="analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="assets"
          element={<AssetsPage />}
        />

        <Route
          path="logs"
          element={<LogsPage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

      </Route>

      <Route
        path="*"
        element={
          <Navigate
            replace
            to="/"
          />
        }
      />

    </Routes>

  );

}
