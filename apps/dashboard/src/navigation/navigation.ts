import {
  Activity,
  Album,
  BarChart3,
  Bot,
  Folder,
  Home,
  Image,
  Library,
  Music,
  ScrollText,
  Settings,
  Workflow,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavigationItem {

  label: string;

  path: string;

  icon: LucideIcon;

}

export const navigation: NavigationItem[] = [

  {

    label: "Dashboard",

    path: "/",

    icon: Home,

  },

  {

    label: "Songs",

    path: "/songs",

    icon: Music,

  },

  {

    label: "Albums",

    path: "/albums",

    icon: Album,

  },

  {

    label: "Agents",

    path: "/agents",

    icon: Bot,

  },

  {

    label: "Workflows",

    path: "/workflows",

    icon: Workflow,

  },

  {

    label: "Prompts",

    path: "/prompts",

    icon: ScrollText,

  },

  {

    label: "Memory",

    path: "/memory",

    icon: Library,

  },

  {

    label: "Artwork",

    path: "/artwork",

    icon: Image,

  },

  {

    label: "Distribution",

    path: "/distribution",

    icon: Activity,

  },

  {

    label: "Analytics",

    path: "/analytics",

    icon: BarChart3,

  },

  {

    label: "Assets",

    path: "/assets",

    icon: Folder,

  },

  {

    label: "Settings",

    path: "/settings",

    icon: Settings,

  },

];
