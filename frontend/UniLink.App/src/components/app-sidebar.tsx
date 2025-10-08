import * as React from "react";
import {
  
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  
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
      title: "Painel",
      url: "/admin/painel",
      icon: IconDashboard,
    },
    {
      title: "Meus Links",
      url: "/admin/meus-links",
      icon: IconListDetails,
    },
    {
      title: "Perfil",
      url: "/admin/perfil",
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
          title: "Entrar",
          url: "/auth/entrar",
        },
        {
          title: "Cadastrar",
          url: "/auth/cadastro",
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
              <div className="flex justify-center gap-2 md:justify-start">
                <a href="#" className="flex items-center gap-2 font-medium">
                  <div className="flex size-6 items-center justify-center rounded-md">
                    <IconLink className="size-4 text-primary" />
                  </div>
                  UniLink
                </a>
              </div>
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
