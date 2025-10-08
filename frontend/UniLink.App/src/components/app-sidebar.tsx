import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconLink,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Gabriel Barros",
    email: "gabriel@exemplo.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Meus Links",
      url: "/admin/links",
      icon: IconListDetails,
    },
    {
      title: "Perfil",
      url: "/admin/profile",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Autenticação",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Login",
          url: "/login",
        },
        {
          title: "Registrar",
          url: "/register",
        },
      ],
    },
    {
      title: "Público",
      icon: IconFolder,
      url: "#",
      items: [
        {
          title: "Página do Usuário",
          url: "/[username]",
        },
        {
          title: "Página Inicial",
          url: "/",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/admin/profile",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Pesquisar",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "API de Links",
      url: "/docs/links",
      icon: IconDatabase,
    },
    {
      name: "Relatórios",
      url: "/admin/dashboard",
      icon: IconReport,
    },
    {
      name: "Editor de Estilo",
      url: "/admin/profile",
      icon: IconFileAi,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center gap-2">
                <IconLink className="!size-6 text-primary" />
                <span className="text-lg font-bold tracking-tight text-primary">UniLink</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
