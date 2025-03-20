import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { HeaderMenu } from "@/components/header-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppSidebar />
      <SidebarInset>
        <HeaderMenu />
        <div className="peer-data-[variant=inset]:peer-data-[state=collapsed]:max-w-full peer-data-[variant=inset]:peer-data-[state=expanded]:max-w-[calc(100vw-var(--sidebar-width))] p-4">
          fasfas{children}
        </div>
      </SidebarInset>
    </div>
  );
}
