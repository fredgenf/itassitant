
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  BotMessageSquare,
  ChevronDown,
  LayoutDashboard,
  Laptop,
  ShieldCheck,
  Users,
  Settings,
  FileScan,
  UserCheck,
  Zap,
  BookMarked,
  BrainCircuit,
  TrendingUp,
  Landmark,
  ShieldAlert,
  Target,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  {
    label: "Workstations",
    icon: Laptop,
    subItems: [
      { href: "/workstations", label: "Overview" },
      { href: "/workstations/scripting", label: "Scripting" },
    ],
  },
  { href: "/users", label: "Users", icon: Users },
  { href: "/inventory", label: "Inventory", icon: Archive },
  {
    label: "Security",
    icon: ShieldAlert,
    subItems: [
      { href: "/security", label: "Posture" },
    ],
  },
    {
    label: "Cyber Security",
    icon: ShieldCheck,
    subItems: [
      { href: "/cyber-security/threat-analysis", label: "Threat Analysis" },
      { href: "/cyber-security/user-activity", label: "User Activity" },
      { href: "/cyber-security/phishing-anticipation", label: "Phishing Anticipation" },
      { href: "/cyber-security/risk-scoring", label: "Risk Scoring" },
    ],
  },
  {
    label: "Predictive",
    icon: BrainCircuit,
    subItems: [
        { href: "/predictive/issue-forecasting", label: "Issue Forecasting"},
        { href: "/predictive/hardware-failure-prediction", label: "Hardware Failure"},
        { href: "/predictive/license-forecasting", label: "License Forecasting"},
        { href: "/predictive/proactive-support", label: "Proactive Support" },
    ]
  },
  {
    label: "Automation",
    icon: Zap,
    subItems: [
        { href: "/automation/impact-analysis", label: "Impact Analysis"},
        { href: "/automation/policy-generator", label: "Policy Generator"},
    ]
  },
  { href: "/support", label: "AI Support", icon: BotMessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();

  const finalMenuItems = menuItems.filter(item => {
    // Hide the old "Security Operations" and "Cyber Security" menus
    if (["Security Operations"].includes(item.label)) return false;
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-base font-semibold">Aether IT</h2>
            <p className="text-xs text-muted-foreground">Autonomous Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {finalMenuItems.map((item) =>
            item.subItems ? (
                <Collapsible key={item.label} className="w-full" defaultOpen={item.subItems.some(sub => pathname.startsWith(sub.href))}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild disabled={item.subItems.length === 0}>
                        <SidebarMenuButton
                          className="w-full justify-start"
                          tooltip={item.label}
                          isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                        >
                          <item.icon className="size-5" />
                          <span>{item.label}</span>
                          {item.subItems.length > 0 && <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ease-in-out group-data-[state=open]:rotate-180" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                            <Link href={subItem.href} passHref>
                                <SidebarMenuSubButton asChild
                                isActive={pathname === subItem.href}
                                >
                                  <span>{subItem.label}</span>
                                </SidebarMenuSubButton>
                            </Link>
                            </SidebarMenuSubItem>
                        ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href!}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="w-full justify-start"
                    tooltip={item.label}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full items-center justify-between p-2"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="person portrait" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@pme.com
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@pme.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
