import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar as useShadcnSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Home,
  Users,
} from "lucide-react";

interface MenuItem {
  name: string;
  route: string;
  label: string;
  icon: React.ComponentType<any>;
}

const menuItems: MenuItem[] = [
  {
    name: "dashboard",
    route: "/",
    label: "Home",
    icon: Home,
  },
  {
    name: "subjects",
    route: "/subjects",
    label: "Subjects",
    icon: BookOpen,
  },
  {
    name: "departments",
    route: "/departments",
    label: "Departments",
    icon: Building2,
  },
  {
    name: "faculty",
    route: "/faculty",
    label: "Faculty",
    icon: Users,
  },
  {
    name: "enrollments",
    route: "/enrollments/create",
    label: "Enrollments",
    icon: ClipboardCheck,
  },
  {
    name: "classes",
    route: "/classes",
    label: "Classes",
    icon: GraduationCap,
  },
];

export function Sidebar() {
  const { open } = useShadcnSidebar();
  const location = useLocation();

  return (
    <ShadcnSidebar collapsible="icon" className="border-none">
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          "transition-discrete",
          "duration-200",
          "flex",
          "flex-col",
          "gap-2",
          "pt-2",
          "pb-2",
          "border-r",
          "border-border",
          {
            "px-3": open,
            "px-1": !open,
          }
        )}
      >
        {menuItems.map((item) => {
          const isSelected = item.route === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.route);

          return (
            <SidebarItemLink
              key={item.name}
              item={item}
              isSelected={isSelected}
            />
          );
        })}
      </ShadcnSidebarContent>
    </ShadcnSidebar>
  );
}

function SidebarHeader() {
  const { open, isMobile } = useShadcnSidebar();

  return (
    <ShadcnSidebarHeader
      className={cn(
        "p-0",
        "h-16",
        "border-b",
        "border-border",
        "flex-row",
        "items-center",
        "justify-between",
        "overflow-hidden"
      )}
    >
      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-2",
          "transition-discrete",
          "duration-200",
          {
            "pl-3": !open,
            "pl-5": open,
          }
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h2
          className={cn(
            "text-sm",
            "font-bold",
            "text-foreground",
            "transition-opacity",
            "duration-200",
            {
              "opacity-0": !open,
              "opacity-100": open,
            }
          )}
        >
          ClassSphere
        </h2>
      </div>

      <ShadcnSidebarTrigger
        className={cn("text-muted-foreground", "mr-1.5", {
          "opacity-0": !open,
          "opacity-100": open || isMobile,
          "pointer-events-auto": open || isMobile,
          "pointer-events-none": !open && !isMobile,
        })}
      />
    </ShadcnSidebarHeader>
  );
}

interface SidebarItemLinkProps {
  item: MenuItem;
  isSelected: boolean;
}

function SidebarItemLink({ item, isSelected }: SidebarItemLinkProps) {
  const Icon = item.icon;

  return (
    <Button
      asChild
      variant="ghost"
      size="lg"
      className={cn(
        "flex w-full items-center justify-start gap-2 py-2 !px-3 text-sm",
        {
          "bg-sidebar-primary": isSelected,
          "hover:!bg-sidebar-primary/90": isSelected,
          "text-sidebar-primary-foreground": isSelected,
          "hover:text-sidebar-primary-foreground": isSelected,
        }
      )}
    >
      <NavLink to={item.route} className="flex w-full items-center gap-2">
        <div
          className={cn("w-4", {
            "text-muted-foreground": !isSelected,
            "text-sidebar-primary-foreground": isSelected,
          })}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn("tracking-[-0.00875rem] line-clamp-1 truncate text-left flex-1", {
            "font-normal": !isSelected,
            "font-semibold": isSelected,
            "text-sidebar-primary-foreground": isSelected,
            "text-foreground": !isSelected,
          })}
        >
          {item.label}
        </span>
      </NavLink>
    </Button>
  );
}

Sidebar.displayName = "Sidebar";
