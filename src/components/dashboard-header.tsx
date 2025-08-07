"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </header>
  );
}
